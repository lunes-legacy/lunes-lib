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

    // remove it just when the code gets into production
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
  transactionAmount = transactionAmount / (10**8);
  let raw = await getUnsignedTransaction({
    pubKey:      keyPair.getPublicKeyBuffer().toString('hex'),
    fee:         5000 / (10**8),
    testnet:     network.testnet,
    fromAddress: keyPair.getAddress(),
    toAddress,
    transactionAmount,
  }).then(e => e.data);

  let tx  = bitcoinjs.Transaction.fromHex(raw);
  let txb = bitcoinjs.TransactionBuilder.fromTransaction(tx);
  txb.sign(0, keyPair)
  let raw = txb.build().toHex();

  let d = await pushtx(raw).then(e => e.data);
  console.log(d);
  return;
}
async function pushtx(raw) {
  let params = new URLSearchParams;
  params.append('signedTransaction',raw);
  return await Axios.post('/v1/transaction/pushtx/',params);
}
/**
 * Spend value from a keyPair wallet
 *
 * @param {Hex(String)} pubKey - Sender's public key
 * @param {String}      toAddress - Address to send the transaction
 * @param {Number}      transactionAmount - Amount to send in satoshis unit - Ex: 50000
 * @param {Number}      feePerByte - Fee per byte to use in satoshis unit - Ex: 32
 * @param {Bool}        testnet -

 * @return {

  }
 */
const getUnsignedTransaction = async (data) => {
  let { pubKey, fromAddress, toAddress, transactionAmount, fee, testnet } = data;
  let params = new URLSearchParams;
  params.append('transaction_version',1);
  params.append('currency_identifier',31);
  params.append('fee',fee);
  params.append('testnet',testnet);
  params.append('pubkey',pubKey);
  params.append('amount_to_transfer',transactionAmount);
  params.append('transaction_from',fromAddress);
  params.append('transaction_to',toAddress);
  return await Axios.post('/v1/transaction/getunsigned/0', params)
  .then(e => e.data)
  .catch(e => errorPattern('Error on trying to get unsigned transaction',500,'GETUNSIGNEDTRANSACTION_ERROR',e));
}
const broadcast = async signedTxHex => {

}

const findUTXOs = async address => {

}


const convertUTXO = utxo => {
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

// const signTx = async (txHex, keyPair) => {
//   let params = new URLSearchParams;
//   params.append('unsigned_hex', txHex);
//   params.append('pubkey', keyPair.getPublicKeyBuffer().toString('hex'));
//   console.log('txHex::',txHex);

//   let r = await Axios.post('/v1/armory/getunsigned',params)
//     .catch(e => {
//       console.log(e);
//     });
//   console.log(r);
// }
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
