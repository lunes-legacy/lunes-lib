const validator = require('../../services/validators/validator')
const { obtainWallet } = require('../coins/obtainWallet.js')

const axios = require('axios')

const BASE_URL = require('../../constants/api')

const { createWallet } = require('../coins')

const endpoint = `${BASE_URL}/users/create`

module.exports = async userData => {
  const { email, password, fullname, testnet } = userData

  if (!validator.areNotEmpty([email, password, fullname])) {
    throw new Error('Email, password and fullname are required fields.')
  }

  if (!validator.isEmail(email)) {
    throw new Error(`${email} is not a valid email.`)
  }

  if (!validator.isValidPassword(password)) {
    throw new Error(
      'Password must contain only letters and numbers, at least 8 chars.'
    )
  }

  const walletData = createWallet(password, testnet)

  try {
    const res = await axios.post(endpoint, {
      email,
      password,
      fullname,
      walletData
    })
    if (res.data.wallet) {
      res.data.wallet.hash = obtainWallet(res.data.wallet.hash, password)
    }
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
