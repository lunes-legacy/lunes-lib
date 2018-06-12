const LnsNetworks = require('../../../services/wallet/lns/networks')
const LnsService = require('../../../services/wallet/lns')
const validator = require('../../../services/validator')
const errorPattern = require('../../../services/errorPattern')

/**
 * Find balance for an address
 *
 * @param leaseData = {
      {String} mnemonic - mnemonic - 12 word mnemonic used to create the Seed
      {Boolean} testnet - if is testnet network
      {String} toAddress - Address to send the lease transaction
      {String} amount - Amount to lease in smallest unit
      {String} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * }
 *
 * @return the transaction id
      network:
      data: {
        txID:
      }
 */
module.exports = async leaseData => {
  try {
    const testnet = validator.checkBoolean(leaseData.testnet)
    const result = await LnsService.lease.startUserLease(
      leaseData,
      testnet ? LnsNetworks.LNSTESTNET : LnsNetworks.LNS
    )
    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on coins.services.lease',
      error.status || 0,
      error.messageKey || 'COINS_SERVICE_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
