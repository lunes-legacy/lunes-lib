const errorPattern = require('../../errorPattern')

/**
 * Cancel a lease transaction with given parameters
 *
 * @param leaseData = {
      {String} mnemonic - 12 word mnemonic used to create the Seed
      {String} txID - The transaction ID for the lease transaction to be canceled
      {String} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * }
 * @param {LnsNetworks} network - Lunes Network

* @return
      network:
      data: {
        txID:
        leaseID:
      }
*/
const startUserCancelLease = async (leaseData, network) => {
  try {
    const axios = require('axios')
    const endpoint = `${require('../../../constants/api')}/coins/mobile/lns/lease-cancel`

    const data = {
      mnemonic: leaseData.mnemonic,
      testnet: network.testnet,
      txID: leaseData.txID,
      fee: leaseData.fee
    }

    const result = await axios.post(endpoint, data)
    return result.data
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on startUserCancelLease',
      error.status || 0,
      error.messageKey || 'START_USER_CANCEL_LNS_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  startUserCancelLease
}
