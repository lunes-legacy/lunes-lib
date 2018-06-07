const validator = require('../../services/validators/validator')

const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/auth2step/save-auth`

module.exports = async (userData) => {
  const { email, timestamp, twofa } = userData
  try {
    const res = await axios.post(endpoint, {email, timestamp, twofa})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
