const validator = require('../../services/validators/validator')

const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/auth2step/verify`

module.exports = async (userData) => {
  const { email, twofa } = userData
  try {
    const res = await axios.post(endpoint, {email, twofa})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
