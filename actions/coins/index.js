const getPrice = require('./getPrice')
const getHistory = require('./getHistory')
const obtainWallet = require('./obtainWallet')
const createDepositWallet = require('./createDepositWallet')
const services = require('./services')
const util = require('./util')

module.exports = {
  obtainWallet,
  getPrice,
  getHistory,
  createDepositWallet,
  services,
  util
}
