const bitcoin = require('./bitcoin')
const getPrice = require('./getPrice')
const getHistory = require('./getHistory')
const obtainWallet = require('./obtainWallet')
const getFees = require('./getFees')
const createDepositWallet = require('./createDepositWallet')
const getBalance = require('./getBalance')

module.exports = {
  bitcoin,
  obtainWallet,
  getPrice,
  getHistory,
  getFees,
  createDepositWallet,
  getBalance
}
