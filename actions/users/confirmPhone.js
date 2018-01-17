const validator = require('../../services/validators/validator')

const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/confirm-phone`

module.exports = async (data, accessToken) => {
  const { phoneNumber } = data
  const headers = { Authorization: `Bearer ${accessToken}` }

  if (!phoneNumber) {
    throw new Error('The Phone number is empty.')
  }
  try {
    const res = await axios.put(endpoint, { phoneNumber }, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
