const axios = require('axios')
const endpoint = `${require('../../../constants/api')}/coins/tx/create`

const validator = require('../../../services/validator')

const BtcNetworks = require('../../../services/wallet/btc/networks')
const BtcService = require('../../../services/wallet/btc')
const LnsNetworks = require('../../../services/wallet/lns/networks')
const LnsService = require('../../../services/wallet/lns')
const BchService = require('../../../services/wallet/bch')

/**
 * Create and send a transaction for given parameters
 *
 * BtcFamily: TODO: update documentation
 * @param transactionData = {
      {String} mnemonic - mnemonic - to create the seed for an address
      {String} network - coin network
      {Boolean} testnet - if is testnet network
      {String} toAddress - Address to send the transaction
      {String} amount - Amount to send in satoshi unit - Ex: 5000000 (0.05 BTC)
      {String} feePerByte - Fee per byte to use in satoshi unit - Ex: 32 (0.00000032 BTC)
 * }
 *
 * Ethereum: TODO: update documentation
 * @param transactionData = {
      {String} mnemonic - mnemonic - to create the seed for an address
      {String} network - coin network
      {Boolean} testnet - if is testnet network
      {String} toAddress - Address to send the transaction
      {String} amount - Amount to send wei unit - Ex: 1500000000000000 (0.0015 ETH)
      {String} gasLimit - Gas limit to use - Ex: 21000
      {String} gasPrice - Gas price to use in wei - Ex: 10000000000 (10 Gwei)
 * }
 *
 * Lunes:
 * @param transactionData = {
      {String} mnemonic - mnemonic - to create the seed for an address
      {String} network - coin network
      {Boolean} testnet - if is testnet network
      {String} toAddress - Address to send the transaction
      {String} amount - Amount to send in smallest unit, 8 precision
      {String} fee - Fee to use in smallest unit, 8 precision - Ex: 100000 (0.001 LNS)
 * }
 *
 * @param accessToken - user's accessToken for authentication
 *
 * @return the transaction id
      network:
      data: {
        txID:
      }
 */
module.exports = async (transactionData, accessToken) => {
  try {
    const network = transactionData.network.toLowerCase()
    const testnet = validator.checkBoolean(transactionData.testnet)
    if (network === 'btc') {
      const result = await BtcService.transaction.startUserTransaction(
        transactionData,
        testnet ? BtcNetworks.BTCTESTNET : BtcNetworks.BTC
      )
      return result
    } if (network === 'bch') {
      const result = await BchService.transaction.startUserTransaction(
        transactionData,
        testnet ? BtcNetworks.BCHTESTNET : BtcNetworks.BCH
      )
      return result
    } else if (network === 'ltc') {
      const result = await BtcService.transaction.startUserTransaction(
        transactionData,
        testnet ? BtcNetworks.LTCTESTNET : BtcNetworks.LTC
      )
      return result
    } else if (network === 'dash') {
      const result = await BtcService.transaction.startUserTransaction(
        transactionData,
        testnet ? BtcNetworks.DASHTESTNET : BtcNetworks.DASH
      )
      return result
    } else if (network === 'eth') {
      const headers = { Authorization: `Bearer ${accessToken}` }
      const res = await axios.post(endpoint, transactionData, { headers })
      return res.data
    } else if (network === 'lns') {
      const result = await LnsService.transaction.startUserTransaction(
        transactionData,
        testnet ? LnsNetworks.LNSTESTNET : LnsNetworks.LNS
      )
      return result
    } else if (network === 'usdt') {
      const result = await BtcService.transaction.startUserTransaction(
        transactionData,
        testnet ? BtcNetworks.USDTTESTNET : BtcNetworks.USDT
      )
      return result
    }
    return ''
    // return res.data
  } catch (err) {
    // throw err.response ? err.response.data : new Error(err)
    return err.response ? err.response.data : err
  }
}
