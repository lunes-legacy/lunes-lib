const axios = require('axios')
const validator = require('../../services/validators/validator')

const endpoint = `${require('../../constants/Cryptocompare')}/price`

module.exports = async params => {
  const { fromSymbol, toSymbol, exchange } = params

  const query = [
    fromSymbol && !validator.isEmpty(fromSymbol) ? `fsym=${fromSymbol}` : '',
    toSymbol && !validator.isEmpty(toSymbol) ? `tsyms=${toSymbol}` : '',
    exchange && !validator.isEmpty(exchange) ? `e=${exchange}` : ''
  ]

  const queryString = query.reduce(
    (q1, q2) => (query.length > 0 ? q1 + '&' + q2 : q1)
  )

  try {
    const res = await axios.get(
      `${endpoint}${queryString.length > 0 ? `?${queryString}` : ''}`
    )
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
