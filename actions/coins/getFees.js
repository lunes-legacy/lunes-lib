const axios = require('axios')
const _ = require('lodash')

const feeURL = 'https://bitaps.com/api/fee'

module.exports = async () => {
  try {
    const result = await axios.get(feeURL).catch(error => {
      return error
    })

    let totalFees = await _.mapValues(result.data, fee => {
      return calculateTotalFee(fee)
    })

    return totalFees
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

const calculateTotalFee = feePerByte => {
  let totalFee = feePerByte * 226
  totalFee = Math.ceil(totalFee)
  return totalFee
}
