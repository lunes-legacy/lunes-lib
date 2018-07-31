const Axios = require('./axios.js');
const decodeHexTransaction = async (hex) => {
  let params = new URLSearchParams;
  params.append('hex', hex);
  return Axios.post('/v1/decode/', params);
}

module.exports = decodeHexTransaction;
