const axios = require('axios')

const createEndpoint = `${require('../../../constants/api')}/coins/tx/create/btc`

/**
 *
 * @param {*} transactionData - email, pin, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (transactionData, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const transactionResponse = await create(headers, transactionData)

    return transactionResponse
  } catch (err) {
    throw err
  }
}

const create = async (headers, transactionData) => {
  try {
    const res = await axios.post(createEndpoint, transactionData, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
