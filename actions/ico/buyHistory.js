const axios = require('axios')

const buyHistoryEndpoint = `${require('../../constants/api')}/ico/buy-history`

/**
 *
 * @param {*} transactionData - email, pin, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (email, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const buyHistory = await create(headers, email)

    return buyHistory
  } catch (err) {
    throw err
  }
}

const create = async (headers, email) => {
  try {
    const res = await axios.post(buyHistoryEndpoint, email, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
