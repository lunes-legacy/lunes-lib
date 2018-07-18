const errorPattern = require('../../errorPattern')

/**
 * Create and send a lease transaction with given parameters
 *
 * @param leaseData = {
      {String} mnemonic - 12 word mnemonic used to create the Seed
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
const startUserLease = async (leaseData, network) => {
  try {
    const axios = require('axios')
    const endpoint = `${require('../../../constants/api')}/coins/mobile/lns/lease`

    const data = {
      mnemonic: leaseData.mnemonic,
      testnet: network.testnet,
      toAddress: leaseData.toAddress,
      amount: leaseData.amount,
      fee: leaseData.fee
    }

    const result = await axios.post(endpoint, data)
    return result.data
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on startUserLease',
      error.status || 0,
      error.messageKey || 'START_USER_LNS_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  startUserLease
}
