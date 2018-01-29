const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/balance`

module.exports = async (params, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  const url = `${endpoint}/btc/${params.address}`
  try {
    const res = await axios.get(
      url,
      { params: { testnet: params.testnet } },
      { headers }
    )
    if (res) {
      return res.data
    }
    return 0
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
