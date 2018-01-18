const axios = require('axios')

const endpoint = `${require('../../constants/api')}/coins`

const getBalance = async (params, accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const url = `${endpoint}/balance/btc/${params.address}`
  try {
    const res = await axios.get(url, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

const getHistory = async (params, accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const url = `${endpoint}/history/btc/${params.address}`
  try {
    const res = await axios.get(url, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

const backupWallet = async (data,accessToken) => {
  const headers = {'Authorization': `Bearer ${accessToken}`}
  const {email} = data
  const url = `${endpoint}/backup-wallet`

  try {
    const res = await axios.post(url, {email}, {headers})
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

module.exports = {
  getBalance,
  backupWallet,
  getHistory
}
