const sb = require('satoshi-bitcoin')

const toBitcoin = value => {
  if (!(typeof value === 'string' || value instanceof String)) {
    value = value.toString()
  }
  value = sb.toBitcoin(value)
  return value
}

const toSatoshi = value => {
  if (!(typeof value === 'string' || value instanceof String)) {
    value = value.toString()
  }
  value = sb.toSatoshi(value)
  return value
}

module.exports = {
  toBitcoin,
  toSatoshi
}
