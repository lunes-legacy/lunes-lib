const errorPattern = require('../../errorPattern')
const LunesJsAPI = require('lunes-js-api')
const wallet = require('./wallet')
const validateAddress = require('./validateAddress')
const balance = require('../../../actions/coins/services/balance')
const bns = require('biggystring')

/**
 * Create and send a lease transaction with given parameters
 *
 * @param transactionData = {
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
    const { toAddress, mnemonic } = leaseData
    const seed = wallet.mnemonicToSeed(mnemonic, network)

    const amount = Number(leaseData.amount)
    const fee = Number(leaseData.fee)

    const result = await createLease(seed, toAddress, amount, fee, network)

    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error on startUserLease',
      error.status || 0,
      error.messageKey || 'START_USER_LNS_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

/**
 * Send lease value from a seed wallet
 *
 * @param {Seed} seed - lunes-js-api's seed of wallet to send the transaction from
 * @param {String} toAddress - Address to send the transaction
 * @param {Number} amount - Amount to send in smallest unit
 * @param {Number} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * @param {LnsNetworks} network - Lunes Network

 * @return the transaction id
      network: ,
      data: {
        txID:
      }
 */
const createLease = async (seed, toAddress, amount, fee, network) => {
  try {
    // Check received address
    const validate = await validateAddress(toAddress, network)
    if (!validate) {
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
    if (amount <= 0) {
      throw errorPattern('Invalid amount', 0, 'INVALID_AMOUNT')
    }

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

    const finalAmount = bns.add(amount.toString(), fee.toString())
    if (userBalance.data.confirmed < finalAmount) {
      throw errorPattern('Balance too small', 0, 'TRANSACTION_LOW_BALANCE')
    }

    // Lease
    const leaseData = {
      recipient: toAddress,
      amount: amount,
      fee: fee
    }

    try {
      const Lunes = LunesJsAPI.create(network.APICONFIG)
      const transaction = await Lunes.API.Node.v1.leasing
        .lease(leaseData, seed.keyPair)
        .then(res => {
          const result = {
            network: network.coinSymbol,
            data: {
              txID: res.id
            }
          }

          return result
        })

      return transaction
    } catch (error) {
      throw errorPattern(
        error.data ? error.data.message : 'Error on lease',
        error.status || 0,
        error.messageKey || 'LEASE_ERROR',
        ''
      )
    }
  } catch (error) {
    throw errorPattern(
      error.message || 'Error creating lunes lease transaction',
      error.status || 0,
      error.messageKey || 'CREATE_LNS_LEASE_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  createLease,
  startUserLease
}
