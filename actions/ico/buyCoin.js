const axios = require('axios')

const buyEndpoint = `${require('../../constants/api')}/ico/buy`

/**
 *
 * @param {*} transactionData - email, pin, receivingAddress, amount, fee, testnet
 * @param {*} accessToken .
 */
module.exports = async (accessToken, email, lunesAmount, coinSymbol, coinAmount, exchangeRate, coupon, network) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const buy = await create(headers, email, lunesAmount, coinSymbol, coinAmount, exchangeRate, coupon, network)

    return buy
  } catch (err) {
    throw err
  }
}

const create = async (headers, email, lunesAmount, coinSymbol, coinAmount, exchangeRate, coupon, network) => {
  try {
    const res = await axios.post(buyEndpoint, {email, lunesAmount, coinSymbol, coinAmount, exchangeRate, coupon, network}, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
