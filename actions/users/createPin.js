const axios = require('axios')

const endpoint = `${process.env.LUNES_SERVER_ENDPOINT}/api/users/security-check/create-pin`

module.exports = async (data,accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  try {
    const res = await axios.post(endpoint, data, {headers})
    return res.data
  } catch (err){
    throw err.response ?err.response.data : new Error(err)
  }
}
