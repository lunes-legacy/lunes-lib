const validator = require('../../services/validators/validator')

const axios = require('axios')

const endpoint = `${process.env.LUNES_SERVER_ENDPOINT}/api/users/create`

module.exports = async userData => {
  const {email, password, fullname} = userData
  const timezone = userData.timezone || 'America/Sao_Paulo'

  if (!validator.areNotEmpty([email, password, fullname, timezone])) {
    throw new Error('Email, password and fullname are required fields.')
  }

  if (!validator.isEmail(email)) {
    throw new Error(`${email} is not a valid email.`)
  }

  if (!validator.isValidPassword(password)) {
    throw new Error('Password must contain only letters and numbers, at least 8 chars.')
  }
  try {
    const res = await axios.post(endpoint, {email, password, fullname, timezone})
    return res.data
  } catch (err) {
    throw new Error(err)
  }
}
