const endpoint = `${require('../../../constants/api')}/coins/history`;
const axios    = require('axios');
// let url = `${endpoint}/${params.network}/${params.address}?testnet=${
//   params.testnet
// }`

module.exports = async (address, testnet) => {
  let url = `${endpoint}/BTC/${address}/?testnet=${testnet}`;
  let r = await axios.get(url)
    .then(r => r.data)
    .catch(e => { throw "status" in e ? e : errorPattern(e.message||'Unknown error',500,'HISTORY_ERROR') })
  return r
}
