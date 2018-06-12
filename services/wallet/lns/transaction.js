const LunesJsApi = require('lunes-js-api')
const validateAddress = require('./validateAddress')
const errorPattern = require('../../errorPattern')
const wallet = require('./wallet')
const bns = require('biggystring')
const balance = require('../../../actions/coins/services/balance')

/**
 * Create and send a transaction for given parameters
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
const startUserTransaction = async (transactionData, network) => {
  try {
    const { toAddress, mnemonic } = transactionData
    const seed = wallet.mnemonicToSeed(mnemonic, network)

    const transactionAmount = Number(transactionData.amount)
    const fee = Number(transactionData.fee)

    const result = await createTransaction(
      seed,
      toAddress,
      transactionAmount,
      fee,
      network
    )

    return result
  } catch (error) {
    throw errorPattern(
      error.message || 'Error lunes startUserTransaction',
      error.status || 500,
      error.messageKey || 'START_USER_LNS_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

/**
 * Spend value from a seed wallet
 *
 * @param {Seed} seed - lunes-js-api's seed of wallet to send the transaction from
 * @param {String} toAddress - Address to send the transaction
 * @param {Number} transactionAmount - Amount to send in smallest unit
 * @param {Number} fee - Fee to use in smallest unit - Ex: 100000 (0.001 LNS)
 * @param {LnsNetworks} network - Lunes Network

 * @return the transaction id
      network: ,
      data: {
        txID:
      }
 */
const createTransaction = async (
  seed,
  toAddress,
  transactionAmount,
  fee,
  network
) => {
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
    if (transactionAmount <= 0) {
      throw errorPattern('Invalid amount', 401, 'INVALID_AMOUNT')
    }

    if (fee < 0) {
      throw errorPattern('Fee cannot be smaller than 0.', 401, 'INVALID_FEE')
    }
    const fromAddress = seed.address

    // Check sender balance
    const userBalance = await balance(fromAddress, network.coinSymbol)

    const finalAmount = bns.add(transactionAmount.toString(), fee.toString())
    if (userBalance.data.confirmed < finalAmount) {
      throw errorPattern('Balance too small', 401, 'TRANSACTION_LOW_BALANCE')
    }

    // Transaction
    const transactionData = {
      assetId: 'WAVES',
      amount: transactionAmount,
      fee: fee,
      recipient: toAddress
    }
    try {
      const Lunes = LunesJsApi.create(network.APICONFIG)
      const transaction = await Lunes.API.Node.v1.assets
        .transfer(transactionData, seed.keyPair)
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
        error.data ? error.data.message : 'Error on transaction',
        error.status || 500,
        error.messageKey || 'ON_TRANSACTION_ERROR',
        ''
      )
    }
  } catch (error) {
    throw errorPattern(
      error.message || 'Error creating lunes transaction',
      error.status || 500,
      error.messageKey || 'CREATE_LNS_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  createTransaction,
  startUserTransaction
}
