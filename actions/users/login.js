const validator = require('../../services/validators/validator')
const obtainWallet = require('../coins/obtainWallet.js')

const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/users/login`

module.exports = async userData => {
  const { email, password } = userData
  if (!validator.isEmail(email)) {
    throw new Error(`${email} is not a valid email.`)
  }
  try {
    const res = await axios.post(endpoint, { email, password })
    if (res.data.wallet) {
      res.data.wallet.hash = obtainWallet(res.data.wallet.hash, password)
    }
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
