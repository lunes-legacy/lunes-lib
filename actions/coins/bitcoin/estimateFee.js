const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/tx/estimate`

/**
 *
 * @param {*} transactionData - senderAddress, receivingAddress, amount, feePerByte, testnet
 * @param {*} accessToken .
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
    const url = `${endpoint}/${transactionData.coin}`
    const res = await axios.post(url, transactionData, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
