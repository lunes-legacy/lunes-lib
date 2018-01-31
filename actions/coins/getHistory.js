const axios = require('axios')
const Promise = require('bluebird')

const apiUrl = `${require('../../constants/Cryptocompare')}`

module.exports = async params => {
  const { fromSymbol, toSymbol, range } = params

  try {
    const url = buildAPIQuery(fromSymbol, toSymbol, range)

    const result = await axios.get(url).catch(error => {
      return error
    })

    const data = await Promise.map(result.data.Data, d => {
      delete d.open
      delete d.high
      delete d.low
      delete d.volumefrom
      delete d.volumeto
      return d
    })

    return {
      success: result.data.Response === 'Success',
      status: result.status,
      message: `Historical chart - ${fromSymbol || 'BTC'} to ${toSymbol ||
        'USD'}`,
      range: range,
      data
    }
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}

const buildAPIQuery = (fromSymbol, toSymbol, range) => {
  let endpoint = 'histohour'
  let aggregate = 1
  let limit = 24

  switch (range) {
  case 'RANGE_1D':
    endpoint = 'histohour'
    aggregate = 1
    limit = 24
    break
  case 'RANGE_1W':
    endpoint = 'histoday'
    aggregate = 1
    limit = 7
    break
  case 'RANGE_1M':
    endpoint = 'histoday'
    aggregate = 1
    limit = 30
    break
  case 'RANGE_3M':
    endpoint = 'histoday'
    aggregate = 3
    limit = 30
    break
  case 'RANGE_6M':
    endpoint = 'histoday'
    aggregate = 6
    limit = 30
    break
  case 'RANGE_1Y':
    endpoint = 'histoday'
    aggregate = 12
    limit = 30
    break
  case 'RANGE_MAX':
    endpoint = 'histoday'
    aggregate = 200
    limit = 2000 // maximum allowed limit
    break
  }

  return `${apiUrl}/${endpoint}?fsym=${fromSymbol}&tsym=${toSymbol}&aggregate=${aggregate}&limit=${limit}`
}
