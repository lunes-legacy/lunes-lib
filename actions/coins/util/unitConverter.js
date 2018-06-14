const EthereumUnits = require('ethereumjs-units')
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

const toWei = value => {
  if (!(typeof value === 'string' || value instanceof String)) {
    value = value.toString()
  }
  value = EthereumUnits.convert(value, 'eth', 'wei')
  return value
}

const toEth = value => {
  if (!(typeof value === 'string' || value instanceof String)) {
    value = value.toString()
  }
  value = EthereumUnits.convert(value, 'wei', 'eth')
  return value
}

module.exports = {
  toBitcoin,
  toSatoshi,
  toWei,
  toEth
}
