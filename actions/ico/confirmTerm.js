const axios = require('axios')

const confirmTermEndpoint = `${require('../../constants/api')}/ico/confirm-term`

/**
 *
 * @param {*} transactionData - email, pin, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (email, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const confirmTerm = await create(headers, email)

    return confirmTerm
  } catch (err) {
    throw err
  }
}

const create = async (headers, email) => {
  try {
    const res = await axios.post(confirmTermEndpoint, {email}, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
