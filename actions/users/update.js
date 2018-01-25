const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/update/`

module.exports = async (id, data, accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const url = `${endpoint}${id}`
  try {
    const res = await axios.patch(url, data, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
