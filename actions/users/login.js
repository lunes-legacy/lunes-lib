const validator = require('../../services/validators/validator')

const axios = require('axios')

const endpoint = `${process.env.LUNES_SERVER_ENDPOINT}/api/users/login`

module.exports = async (userData) => {
  const {email, password} = userData
  if (!validator.isEmail(email)) {
    throw new Error(`${email} is not a valid email.`)
  }
  try {
    const res = await axios.post(endpoint, { email, password })
    return res.data
  } catch (err) {
    throw new Error(err)
  }
}
