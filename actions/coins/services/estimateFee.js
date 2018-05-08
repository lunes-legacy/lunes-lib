const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/tx/estimate`

/**
 * Estimate transaction fee for given parameters
 *
 * BtcFamily:
 * @param transactionData = {
      {String} network - coin network
      {String} testnet - if is testnet network
      {String} receivingAddress - Address to send the transaction
      {String} senderAddress - Address sending the transaction
      {String} amount - Amount to send in satoshi unit - Ex: 5000000 (0.05 BTC)
      {String} feePerByte - Fee per byte to use in satoshi unit - Ex: 32 (0.00000032 BTC)
 * }
 *
 * Ethereum:
 * @param transactionData = {
      {String} network - coin network
      {String} testnet - if is testnet network
      {String} toAddress - Address to send the transaction
      {String} fromAddress - Address sending the transaction
      {String} amount - Amount to send wei unit - Ex: 1500000000000000 (0.0015 ETH)
      {String} gasLimit - Gas limit to use - Ex: 21000
      {String} gasPrice - Gas price to use in wei - Ex: 10000000000 (10 Gwei)
 * }
 *
 * @param accessToken - user's accessToken for authentication
 *
 * BtcFamily:
 * @return fee in satoshi unit
      network:
      data: {
        fee:
      }
 *
 * Ethereum:
 * @return fee in wei unit
      network:
      data: {
        txFee:
        gasPrice:
        gasLimit:
      }
 */
module.exports = async (transactionData, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    const transactionResponse = await create(headers, transactionData)

    return transactionResponse
  } catch (err) {
    throw err
  }
}

const create = async (headers, transactionData) => {
  try {
    const url = `${endpoint}/${transactionData.network}`
    const res = await axios.post(url, transactionData, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
