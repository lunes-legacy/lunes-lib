const axios = require('axios')

const endpoint = `${require('../../constants/api')}/ico/verify-user-withdraw`

/**
 *TODO:
 */
module.exports = async accessToken => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    const res = await axios.get(endpoint, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
