const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/history`

/**
 * Obtain transaction history for an address.
 *
 * @param params = {
      {String} address - Address to use
      {String} network - network network
      {Boolean} testnet - if is testnet network
 * }
 *
 * @return
      network:
      data: {
        address:
        history: [ type:
                  otherParams:
                  txid:
                  date:
                  blockHeight:
                  nativeAmount:
                  networkFee:
                ]
      }
 */
module.exports = async params => {
  let url = `${endpoint}/${params.network}/${params.address}?testnet=${
    params.testnet
  }`
  try {
    const res = await axios.get(url)
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
