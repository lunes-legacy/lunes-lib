const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/logout`

module.exports = async (accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}

  try {
    const res = await axios.get(endpoint, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
