const getBalance = require('./getBalance')
const getHistory = require('./getHistory')
const createTransaction = require('./createTransaction')
const estimateFee = require('./estimateFee')

module.exports = {
  getBalance,
  getHistory,
  createTransaction,
  estimateFee
}
