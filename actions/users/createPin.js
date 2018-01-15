const axios = require('axios')

const validator = require('../../services/validators/validator')

const endpoint = `${process.env.LUNES_SERVER_ENDPOINT}/api/users/security-check/create-pin`

module.exports = async (data,accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}

  if(!validator.isPIN(data.pin)){
    throw new Error('Insira um PIN válido (4 números).')
  }

  try {
    const res = await axios.post(endpoint, data, {headers})
    return res.data
  } catch (err){
    throw err.response ?err.response.data : new Error(err)
  }
}
