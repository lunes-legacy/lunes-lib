const _ = require('lodash')
const bitcoinjs = require('bitcoinjs-lib')
const coinSelect = require('coinselect')
const errorPattern = require('../../errorPattern')
const UsdtWallet = require('./wallet')
const BtctWallet = require('./../btc/wallet')
// const ElectrumAPI = require('./api/electrumApi')
//Should be removed
const networks = require('./../../../constants/networks.js');
//Should be removed
const ValidateAddress = require('../validateAddress')
const Axios = require('./axios')
const unitConverter = require('./../../../actions/coins/util/unitConverter.js');

let bitcoinjsnetwork
let electrumNetwork
let ecl = 'undefined'

/**
 * Create and send a transaction for given parameters
 *
 * @param transactionData = {
      {String} mnemonic - to create the seed for an address
      {String} toAddress - Address to send the transaction
      {String} amount - Amount to send in satoshi unit - Ex: 5000000 (0.05 BTC)
      {String} feePerByte - Fee per byte to use in satoshi unit - Ex: 32 (0.00000032 BTC)
 * }
 * @param {BtcNetworks} network - Bitcoin Network
 *
 * @return the transaction id
      network:
      data: {
        txID:
      }
 */
const startUserTransaction = async (transactionData, network) => {
  try {
    const { toAddress, mnemonic } = transactionData
    // const keyPair = UsdtWallet.mnemonicToKeyPair(mnemonic, network)
    const keyPair = BtctWallet.mnemonicToKeyPair(mnemonic, networks['BTC'])

    const transactionAmount = Number(transactionData.amount)
    const feePerByte = Number(transactionData.feePerByte)


    console.log(`=== Starting ${network.coinSymbol} transaction ===`);
    console.log(`__________________________________________`);
    console.log(`Mnemonic____: ${mnemonic}`);
    console.log(`From________: ${keyPair.getAddress()}`);
    console.log(`To__________: ${toAddress}`);
    console.log(`Amount______: ${transactionAmount} (satoshi)`);
    console.log(`FeePerByte__: ${feePerByte} (satoshi)`);
    console.log(`__________________________________________`);

    const result = await createTransaction(
      keyPair,
      toAddress,
      transactionAmount,
      feePerByte,
      network
    )

    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error startUserTransaction',
      error.status || 500,
      error.messageKey || 'START_USER_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

/**
 * Spend value from a keyPair wallet
 *
 * @param {ECPair} keyPair - bitcoinjs-lib's keypair of wallet to send the transaction from
 * @param {String} toAddress - Address to send the transaction
 * @param {Number} transactionAmount - Amount to send in satoshis unit - Ex: 50000
 * @param {Number} feePerByte - Fee per byte to use in satoshis unit - Ex: 32
 * @param {BtcNetworks} network - Bitcoin Network

 * @return the transaction id
      network:
      data: {
        txID:
      }
 */
const createTransaction = async (
  keyPair,
  toAddress,
  transactionAmount,
  feePerByte,
  network
) => {
  try {
    //it should be removed ?
    if (network.coinSymbol.search(/(usdt)/i) === -1) {
      if (!ValidateAddress(toAddress, network.coinSymbol, network.testnet)) {
        throw errorPattern(
          'Invalid ' + network.coinName + ' Address',
          406,
          'ADDRESS_INVALID',
          'The address ' +
            toAddress +
            ' is not a valid ' +
            network.coinName +
            ' address.'
        )
      }
    }

    // don't try to send negative values
    if (transactionAmount <= 0) {
      throw errorPattern('Invalid amount', 401, 'INVALID_AMOUNT')
    }

    if (feePerByte < 0) {
      throw errorPattern(
        'Fee per byte cannot be smaller than 0.',
        401,
        'INVALID_FEE'
      )
    }

    bitcoinjsnetwork = network.bitcoinjsNetwork
    // electrumNetwork = network

    // senderAddress
    const fromAddress = keyPair.getAddress()

    // 1. find utxos
    const utxos = await findUTXOs(fromAddress)
    // console.log(utxos);
    // return;

    // address with unconfirmed output
    if (utxos.length === 0) {
      throw errorPattern(
        'Sender balance with not enough confirmations.',
        401,
        'TRANSACTION_UNCONFIRMED_BALANCE'
      )
    }

    // 3. set target and ammount
    const targets = [
      {
        address: toAddress,
        value: transactionAmount
      }
    ]

    let { inputs, outputs } = coinSelect(utxos, targets, feePerByte)

    // console.log('INP::: ',inputs);
    // console.log('_______________');
    // console.log('OUT::: ',outputs);
    // return;

    // .inputs and .outputs will be undefined if no solution was found
    if (!inputs || !outputs) {
      throw errorPattern('Balance too small.', 401, 'TRANSACTION_LOW_BALANCE')
    }

    // 4. build the transaction
    let txb = new bitcoinjs.TransactionBuilder(bitcoinjsnetwork)

    // 4.1. outputs
    outputs.forEach(output => {
      // Add change address (sender)
      if (!output.address) {
        output.address = fromAddress
      }

      txb.addOutput(output.address, output.value)
    })

    // 4.2 inputs
    inputs.forEach(input => {
      txb.addInput(input.txid, input.vout)
    })

    // 5. sign
    txb = sign(txb, keyPair)

    // console.log(txb);
    // return;
    txb.tx.data_protocol = 'SP';
    // console.log('txb:',txb);
    // console.log('txb.tx',txb.tx);
    // return;
    let txHex = txb.build().toHex();
    // const txHex = txb.build().toHex()
    // console.log('OPS::', txHex);

    // 6. broadcast
    const broadcastResult = await broadcast(txHex)

    const result = {
      network: network.coinSymbol,
      data: {
        txID: broadcastResult
      }
    }
    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error creating transaction',
      error.status || 500,
      error.messageKey || 'CREATE_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

const broadcast = async signedTxHex => {
  let params = new URLSearchParams;
  params.append('signedTransaction', signedTxHex);
  let result = await Axios.post('/v1/transaction/pushtx/', params)
    .catch((e) => {
      let { status, headers } = e.response;
      throw errorPattern('Error on trying to broadcast the transaction',status,'BROADCASTTX_ERROR',{headers, data: e.data});
    });

  let { status, pushed, message, code } = result.data;
  if (status !== 'OK')
    throw errorPattern(pushed, 500, 'BROADCASTTX_ERROR', result);
  // throw errorPattern(pushed, 500, 'BROADCASTTX_ERROR', result.data);

  return result;
}

const findUTXOs = async address => {
  const onlyTetherTransactions = (transactions) => {
    if (!(transactions instanceof Array))
      throw errorPattern(`Only arrays are accepted in this function`,500,'FINDUTXOS_ERROR');

    return transactions.filter((tx) => {
      return tx.propertyid === 31;
    });
  }

  let params = new URLSearchParams;
  params.append('addr',address);
  let result = await Axios.post('/v1/transaction/address', params)
    .catch(e => {
      let { status, headers } = e.response;
      throw errorPattern('Error on trying to get unspent transactions',status,'TRANSACTION_ERROR',headers);
    });

  if (result.data.transactions.length < 1)
    throw errorPattern('No unspent transaction was found',500,'TRANSACTION_EMPTY_UTXO');

  return convertUTXOs( onlyTetherTransactions(result.data.transactions) );
}

const convertUTXOs = (utxos) => {
  if (!(utxos instanceof Array))
    throw errorPattern(`This function only accepts array from the 'utxos' parameter`,500,'CONVERT_UTXOS_ERROR');

  return utxos.map((utxo) => {
    return {
      txid:  utxo.txid,
      value: unitConverter.toSatoshi(utxo.amount),
      vout:  0
    }
  });
}
const convertUTXO = utxo => {
  return; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  try {
    const newUtxo = {
      txId: utxo.tx_hash,
      vout: 0,
      value: utxo.value
    }
    return newUtxo
  } catch (error) {
    throw errorPattern(
      error.message || 'Error converting utxos',
      error.status || 500,
      error.messageKey || 'CONVERT_UTXOS_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

const sign = (tx, keyPair) => {
  try {
    _.times(tx.inputs.length, i => tx.sign(i, keyPair))
    return tx
  } catch (error) {
    throw errorPattern(
      error.message || 'Error signing transaction',
      error.status || 500,
      error.messageKey || 'SIGN_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  startUserTransaction,
  createTransaction,
  findUTXOs,
  broadcast,
  convertUTXO,
  sign
}
