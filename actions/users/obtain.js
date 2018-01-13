const axios = require('axios')

const endpoint = `${process.env.LUNES_SERVER_ENDPOINT}/api/users/`

module.exports = async (id, accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const url = `${endpoint}${id}`

  try {
    const res = await axios.get(url, {headers})
    return res.data
  } catch (err) {
    throw err.response ?err.response.data : new Error(err)
  }
};
