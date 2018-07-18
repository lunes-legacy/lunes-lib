const LnsNetworks = require('../../../services/wallet/lns/networks')
const LnsService = require('../../../services/wallet/lns')
const validator = require('../../../services/validator')
const errorPattern = require('../../../services/errorPattern')

/**
 * Obtain total leased balance of a Lunes coin address
 *
 * @param params = {
      {String} address - Address to use
      {Boolean} testnet - if is testnet network
 * }
 *
 * @return
 *    network:
      data: {
        leaseBalance:
      }
 */
module.exports = async params => {
  try {
    const testnet = validator.checkBoolean(params.testnet)
    const result = await LnsService.leaseBalance(
      params.address,
      testnet ? LnsNetworks.LNSTESTNET : LnsNetworks.LNS
    )
    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on coins.services.leaseBalance',
      error.status || 0,
      error.messageKey || 'COINS_SERVICE_LEASE_BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
