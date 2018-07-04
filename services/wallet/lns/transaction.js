const errorPattern = require('../../errorPattern')

/**
 * Create and send a transaction for given parameters
 *
 * @param transactionData = {
      {String} mnemonic - to create the seed for an address
      {String} toAddress - Address to send the transaction
      {String} amount - Amount to send in smallest unit
      {String} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * }
 * @param {LnsNetworks} network - Lunes Network

* @return the transaction id
      network:
      data: {
        txID:
      }
*/
const startUserTransaction = async (transactionData, network) => {
  try {
    const axios = require('axios')
    const endpoint = `${require('../../../constants/api')}/coins/mobile/lns/transaction`

    const data = {
      mnemonic: transactionData.mnemonic,
      testnet: network.testnet,
      toAddress: transactionData.toAddress,
      amount: transactionData.amount,
      fee: transactionData.fee
    }

    const result = await axios.post(endpoint, data)
    return result.data
  } catch (error) {
    throw errorPattern(
      error.message || 'Error lunes startUserTransaction',
      error.status || 500,
      error.messageKey || 'START_USER_LNS_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  startUserTransaction
}
