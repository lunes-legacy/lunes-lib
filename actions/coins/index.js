const bitcoin = require('./bitcoin')
const getPrice = require('./getPrice')
const getHistory = require('./getHistory')
const createWallet = require('./createWallet')
const obtainWallet = require('./obtainWallet')
const createTransaction = require('./createTransaction')
module.exports = {
  bitcoin,
  createWallet,
  obtainWallet,
  getPrice,
  getHistory,
  createTransaction
}
