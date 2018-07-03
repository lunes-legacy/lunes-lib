const axios = require('axios')
const endpoint = `${require('../../constants/api')}/coins/mobile/mnemonic`

const generateMnemonic = async () => {
  const data = {
    method: 'generateMnemonic'
  }

  const result = await axios.post(endpoint, data)
  return result.data
}

const validateMnemonic = async mnemonic => {
  const data = {
    mnemonic: mnemonic,
    method: 'validateMnemonic'
  }

  const result = await axios.post(endpoint, data)
  return result.data
}

const mnemonicToSeed = async mnemonic => {
  const data = {
    mnemonic: mnemonic,
    method: 'mnemonicToSeed'
  }

  const result = await axios.post(endpoint, data)
  return result.data
}

module.exports = {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeed
}
