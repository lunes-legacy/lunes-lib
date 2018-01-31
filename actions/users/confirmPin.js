const validator = require('../../services/validators/validator')

const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/confirm-pin`

module.exports = async (data, accessToken) => {
  const { pin } = data
  const headers = { Authorization: `Bearer ${accessToken}` }

  if (!pin || !validator.isPIN(pin)) {
    throw new Error('The PIN code is invalid.')
  }
  try {
    const res = await axios.post(endpoint, { pin }, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
