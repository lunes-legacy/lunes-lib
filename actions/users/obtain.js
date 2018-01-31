const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/obtain/`

module.exports = async (id, accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const url = `${endpoint}${id}`

  try {
    const res = await axios.get(url, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
