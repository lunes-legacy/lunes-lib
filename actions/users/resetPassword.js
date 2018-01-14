const validator = require('../../services/validators/validator')

const axios = require('axios')

const endpoint = `${process.env.LUNES_SERVER_ENDPOINT}/api/users/reset-password`

module.exports = async (userData) => {
  const { email } = userData
  if (!validator.isEmail(email)) {
    throw new Error(`${email} is not a valid email.`)
  }
  try {
    const res = await axios.post(endpoint, {email})
    return res.data
  } catch (err) {
    throw err.response ?err.response.data : new Error(err)
  }
}
