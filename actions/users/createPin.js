const axios = require('axios')

const validator = require('../../services/validators/validator')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/security-check/create-pin`

module.exports = async (data, accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const {pin} = data

  if (!validator.isPIN(pin)) {
    throw new Error('Insira um PIN válido (4 números).')
  }

  try {
    const res = await axios.post(endpoint, {pin}, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
