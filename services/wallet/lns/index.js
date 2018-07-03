const wallet = require('./wallet')
const transaction = require('./transaction')
const validateAddress = require('./validateAddress')
const balance = require('./balance')

module.exports = {
  wallet,
  transaction,
  validateAddress,
  balance
}
