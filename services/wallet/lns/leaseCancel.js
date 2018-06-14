const errorPattern = require('../../errorPattern')
const LunesJsAPI = require('lunes-js-api')
const wallet = require('./wallet')
const balance = require('../../../actions/coins/services/balance')

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
    const { txID, mnemonic } = leaseData
    const seed = wallet.mnemonicToSeed(mnemonic, network)

    const fee = Number(leaseData.fee)

    const result = await cancelLease(seed, txID, fee, network)

    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on startUserCancelLease',
      error.status || 0,
      error.messageKey || 'START_USER_CANCEL_LNS_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

/**
 * Cancel lease transaction from a seed wallet
 *
 * @param {Seed} seed - lunes-js-api's seed of wallet to send the transaction from
 * @param {String} txID - The transaction ID for the lease transaction to be canceled
 * @param {Number} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * @param {LnsNetworks} network - Lunes Network

 * @return
      network:
      data: {
        txID:
        leaseID:
      }
 */
const cancelLease = async (seed, txID, fee, network) => {
  try {
    if (fee < 0) {
      throw errorPattern('Fee cannot be smaller than 0.', 0, 'INVALID_FEE')
    }
    const fromAddress = seed.address

    // Check sender balance
    const userBalance = await balance({
      address: fromAddress,
      network: network.coinSymbol,
      testnet: network.testnet
    })

    if (userBalance.data.confirmed < fee) {
      throw errorPattern('Balance too small', 0, 'TRANSACTION_LOW_BALANCE')
    }

    // Cancel Lease
    const cancelLeaseData = {
      transactionId: txID,
      fee: fee
    }

    try {
      const Lunes = LunesJsAPI.create(network.APICONFIG)
      const transaction = await Lunes.API.Node.v1.leasing
        .cancelLeasing(cancelLeaseData, seed.keyPair)
        .then(res => {
          const result = {
            network: network.coinSymbol,
            data: {
              txID: res.id,
              leaseID: res.leaseId
            }
          }

          return result
        })

      return transaction
    } catch (error) {
      throw errorPattern(
        error.data ? error.data.message : 'Error on cancel lease',
        error.status || 0,
        error.messageKey || 'CANCEL_LEASE_ERROR',
        ''
      )
    }
  } catch (error) {
    throw errorPattern(
      error.message || 'Error canceling lunes lease transaction',
      error.status || 0,
      error.messageKey || 'CANCEL_LNS_LEASE_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  cancelLease,
  startUserCancelLease
}
