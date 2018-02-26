const axios = require('axios')

const buyBalanceEndpoint = `${require('../../constants/api')}/ico/buy-balance`

/**
 *
 * @param {*} transactionData - email, pin, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (email, accessToken, salePhase) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const buyBalance = await create(headers, email, salePhase)

    return buyBalance
  } catch (err) {
    throw err
  }
}

const create = async (headers, email, salePhase) => {
  try {
    const res = await axios.post(buyBalanceEndpoint, {email, salePhase}, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
