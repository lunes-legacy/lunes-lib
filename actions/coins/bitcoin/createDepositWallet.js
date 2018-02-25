const axios = require('axios')

const createDepositWalletEndpoint = `${require('../../../constants/api')}/deposit/wallet/create/btc`

/**
 *
 * @param {*} transactionData - email, pin, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (email, accessToken, testnet) => {

  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const depositResponse = await create(headers, email, testnet)

    return depositResponse
  } catch (err) {
    throw err
  }
}

const create = async (headers, email, testnet) => {
  try {
    const res = await axios.post(createDepositWalletEndpoint, {email, testnet}, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
