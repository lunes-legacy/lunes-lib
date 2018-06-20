const EthereumUtil = require('ethereumjs-util')

module.exports = (address) => {
  return EthereumUtil.isValidAddress(address)
}
