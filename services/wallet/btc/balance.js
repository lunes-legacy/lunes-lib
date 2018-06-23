const axios = require('axios')
const endpoint = `${require('../../../constants/api')}/coins/balance`

module.exports = async (address, network) => {
  let url = `${endpoint}/${network.coinSymbol}/${address}?testnet=${
    network.testnet
  }`

  const serverResponse = await axios.get(url)
  
  return serverResponse.data
}
