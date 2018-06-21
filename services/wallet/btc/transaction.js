const _ = require('lodash')
const bitcoinjs = require('bitcoinjs-lib')
const coinSelect = require('coinselect')
const errorPattern = require('../../errorPattern')
const BtcWallet = require('./wallet')
const ElectrumAPI = require('./api/electrumApi')
const ValidateAddress = require('../validateAddress')

let bitcoinjsnetwork
let electrumNetwork
let ecl = 'undefined'

/**
 * Create and send a transaction for given parameters
 *
 * @param transactionData = {
      {String} mnemonic - 12 word mnemonic used to create the KeyPair
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
    const keyPair = BtcWallet.mnemonicToKeyPair(mnemonic, network)

    const transactionAmount = Number(transactionData.amount)
    const feePerByte = Number(transactionData.feePerByte)

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
    electrumNetwork = network.coinSymbol

    // senderAddress
    const fromAddress = keyPair.getAddress()

    // 1. find utxos
    const utxoResult = await findUTXOs(fromAddress)

    if (utxoResult.length === 0) {
      throw errorPattern(
        'Sender has no spendable transactions.',
        401,
        'TRANSACTION_EMPTY_UTXO'
      )
    }

    const utxos = []

    // 2. convert utxos
    // TODO: test with unconfirmed utxos
    utxoResult.forEach(utxo => {
      if (utxo.height !== 0) {
        const aux = convertUTXO(utxo)
        utxos.push(aux)
      }
    })

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
      txb.addInput(input.txId, input.vout)
    })

    // 5. sign
    txb = sign(txb, keyPair)

    const txHex = txb.build().toHex()

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
  try {
    if (ecl === 'undefined') {
      ecl = await ElectrumAPI(electrumNetwork)
    }

    const broadcastResponse = await ecl.blockchainTransaction_broadcast(
      signedTxHex
    )

    // check if rejected transaction
    if (broadcastResponse.indexOf('rejected') >= 0) {
      throw errorPattern(broadcastResponse, 401, 'BROADCAST_REJECTED_ERROR')
    } else {
      return broadcastResponse
    }
  } catch (error) {
    throw errorPattern(
      error.message || 'Error broadcasting transaction',
      error.status || 500,
      error.messageKey || 'BROADCAST_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

const findUTXOs = async address => {
  try {
    if (ecl === 'undefined') {
      ecl = await ElectrumAPI(electrumNetwork)
    }
    const utxos = await ecl.blockchainAddress_listunspent(address)
    return utxos
  } catch (error) {
    throw errorPattern(
      error.message || 'Error finding address utxos',
      error.status || 500,
      error.messageKey || 'FIND_UTXOS_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

const convertUTXO = utxo => {
  try {
    const newUtxo = {
      txId: utxo.tx_hash,
      vout: utxo.tx_pos,
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
