const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/users/validate-token`

/**
 * Validate user's access token
 *
 * @param {String} token - user's access token
 *
 * @return {
      status:
      data::
      }
*
* Valid status response:
* TokenValid - The access token is valid and active
* Error status responses:
* TokenExpiredError - Token is expired
* JsonWebTokenError - Other errors for jsonwebtoken
 */
module.exports = async token => {
  try {
    const res = await axios.post(endpoint, token)
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
