const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/history`

module.exports = async (params, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  let url = `${endpoint}/btc/${params.address}?testnet=${params.testnet}`
  try {
    const res = await axios.get(url, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
