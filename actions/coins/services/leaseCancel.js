const LnsNetworks = require('../../../services/wallet/lns/networks')
const LnsService = require('../../../services/wallet/lns')
const validator = require('../../../services/validator')
const errorPattern = require('../../../services/errorPattern')

/**
 * Cancel a lease transaction for given parameters
 *
 * @param cancelLeaseData = {
      {String} mnemonic - mnemonic - 12 word mnemonic used to create the Seed
      {Boolean} testnet - if is testnet network
      {String} txID - The transaction ID for the lease transaction to be canceled
      {String} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * }
 *
 * @return the transaction id
      network:
      data: {
        txID:
        leaseID:
      }
 */
module.exports = async cancelLeaseData => {
  try {
    const testnet = validator.checkBoolean(cancelLeaseData.testnet)
    const result = await LnsService.cancelLease.startUserCancelLease(
      cancelLeaseData,
      testnet ? LnsNetworks.LNSTESTNET : LnsNetworks.LNS
    )
    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on coins.services.leaseCancel',
      error.status || 0,
      error.messageKey || 'COINS_SERVICE_CANCEL_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
