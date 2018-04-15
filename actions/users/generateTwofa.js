const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/auth2step/generate`

module.exports = async (userData) => {
  const { email, twofa } = userData
  try {
    const res = await axios.get(`${endpoint}?email=${email}`)
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
