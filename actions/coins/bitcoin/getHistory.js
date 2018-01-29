const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/history`

module.exports = async (params, accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  const url = `${endpoint}/btc/${params.address}`
  try {
    const res = await axios.get(
      url,
      { params: { testnet: params.testnet } },
      { headers }
    )
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
