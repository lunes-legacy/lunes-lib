const axios = require('axios')
let bitcoin = require('react-native-bitcoinjs-lib')
let bip39 = require('react-native-bip39')
const _ = require('lodash')
const validator = require('../../services/validators/validator')

const createEndpoint = `${require('../../constants/api')}/coins/tx/create/btc`
const broadcastEndpoint = `${require('../../constants/api')}/coins/tx/broadcast/btc`

let network

/**
 *
 * @param {*} transactionData - mnemonic, sendersAddress, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (transactionData, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    const testnet = validator.isTestnet(transactionData.testnet)
    network = testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin

    // 1. create transaction
    const unsignedHex = await create(headers, transactionData)

    if (unsignedHex.status) {
      if (unsignedHex.status !== 201) {
        throw new Error(unsignedHex.message)
      }
    }

    // 2. obtain unsigned transaction
    var txb = bitcoin.TransactionBuilder.fromTransaction(
      bitcoin.Transaction.fromHex(unsignedHex),
      network
    )

    // 3. obtain wallet
    const keyPair = mnemonicToKeyPair(transactionData.mnemonic, network)

    // 4. sign
    const signedTx = sign(txb, keyPair)

    // 5. toSignedHex
    const signedTxHex = signedTx.build().toHex()

    // 6. broadcast
    const broadcastResult = await broadcast(
      headers,
      signedTxHex,
      transactionData.testnet
    )
    return broadcastResult
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

const create = async (headers, transactionData) => {
  // don't send user's mnemonic
  const data = Object.assign({}, transactionData)
  if (data.mnemonic) delete data.mnemonic
  try {
    const res = await axios.post(
      createEndpoint,
      data,
      { params: { testnet: data.testnet } },
      { headers }
    )
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

const mnemonicToKeyPair = (mnemonic, network) => {
  // 1. mnemonic words to seed hex
  const seedHex = bip39.mnemonicToSeedHex(mnemonic)

  // 2. create a Bitcoinjs HD Wallet
  const hdNode = bitcoin.HDNode.fromSeedHex(seedHex, network)

  // 3. obtain keyPair
  const path = 'm/0\'/0/0' // m/0'/0/0
  const keyPair = hdNode.derivePath(path)
  return keyPair
}

/**
 *
 * @param {bitcoin.TransactionBuilder} tx .
 * @param {bitcoin.HDNode} keyPair .
 */
const sign = (tx, keyPair) => {
  _.times(tx.inputs.length, i => tx.sign(i, keyPair))
  return tx
}

const broadcast = async (headers, signedTxHex, testnet) => {
  try {
    const res = await axios.post(
      broadcastEndpoint,
      { signedTxHex },
      { params: { testnet: testnet } },
      { headers }
    )
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
