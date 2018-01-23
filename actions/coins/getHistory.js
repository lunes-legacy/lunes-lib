const axios = require('axios')
const Promise = require('bluebird')

const validator = require('../../services/validators/validator')
const calendar = require('../../services/calendar')

const endpoint = `${require('../../constants/Cryptocompare')}`

module.exports = async (params) => {
  const {fromDate, toDate, fromSymbol, toSymbol, exchange} = params

  if (!fromDate || !toDate) {
    throw new Error('The chart interval must be defined.')
  }
  const hourDiff = calendar.diff(toDate, fromDate, 'hours')
  const historyType = hourDiff >= 24 ? '/histoday?' : '/histohour?'
  const query = [
    'fsym=FROM_SYMBOL',
    'tsym=TO_SYMBOL',
    exchange && !validator.isEmpty(exchange) ? `e=${exchange}` : ''
  ]
  const queryString = query
    .reduce((q1, q2) => query.length > 0 ? q1 + '&' + q2 : q1)
    .concat(`${calendar.getTimestamp(toDate)}`)
    .replace('FROM_SYMBOL', fromSymbol || 'BTC')
    .replace('TO_SYMBOL', toSymbol || 'USD')

  const url = `${endpoint}${historyType}${queryString}`
  try {
    const res = await axios.get(url)
    const mappedRes = await Promise.map(res.data.Data, d => {
      delete d.close
      delete d.open
      delete d.volumefrom
      delete d.volumeto
      d.day = calendar.getCompleteDate(d.time, hourDiff < 24 ? 'DD/MM/YY HH:mm:ss' : 'DD/MM/YY')
      delete d.time
      return d
    })
    const data = await Promise.filter(mappedRes, r => !calendar.isBefore(r.day, fromDate))
    return {
      success: res.data.Response === 'Success',
      status: res.status,
      message: `Historical chart - ${fromSymbol || 'BTC'} to ${toSymbol || 'USD'}`,
      period: `${fromDate} to ${toDate}`,
      data
    }
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
