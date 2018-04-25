const create = require('./create')
const login = require('./login')
const resetPassword = require('./resetPassword')
const obtain = require('./obtain')
const createPin = require('./createPin')
const confirmPin = require('./confirmPin')
const confirmPhone = require('./confirmPhone')
const logout = require('./logout')
const update = require('./update')
const verifyTwofa = require('./verifyTwofa');
const generateTwofa = require('./generateTwofa');
const saveTwofa = require('./saveTwofa');

module.exports = {
  create,
  login,
  resetPassword,
  obtain,
  createPin,
  confirmPin,
  confirmPhone,
  logout,
  update,
  verifyTwofa,
  generateTwofa,
  saveTwofa
}
