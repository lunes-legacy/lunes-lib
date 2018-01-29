const bitcoin = require('./bitcoin')
const getPrice = require('./getPrice')
const getHistory = require('./getHistory')
const obtainWallet = require('./obtainWallet')
const getFees = require('./getFees')
module.exports = {
  bitcoin,
  obtainWallet,
  getPrice,
  getHistory,
  getFees
}
