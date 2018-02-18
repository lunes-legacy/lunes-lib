
const axios = require('axios')

const BASE_URL = require('../../constants/api')

const endpoint = `${BASE_URL}/ico/phase`

module.exports = async () => {
  try {
    const res = await axios.post(endpoint)
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
