const errorPattern = require('../../errorPattern')
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
    const axios = require('axios')
    const endpoint = `${require('../../../constants/api')}/coins/mobile/btc/transaction`

    const data = {
      mnemonic: transactionData.mnemonic,
      testnet: network.testnet,
      toAddress: transactionData.toAddress,
      amount: transactionData.amount,
      feePerByte: transactionData.feePerByte
    }

    const result = await axios.post(endpoint, data)
    return result.data
  } catch (error) {
    throw errorPattern(
      error.message || 'Error startUserTransaction',
      error.status || 500,
      error.messageKey || 'START_USER_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  startUserTransaction
}
