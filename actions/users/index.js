const {firebase} = require('../../services/firebase/index')
const create = require('./create')
const login = require('./login')
const resetPassword = require('./resetPassword')
const obtain = require('./obtain')
const createPin = require('./createPin')

module.exports = config => {
  if (config == null) {
    throw new Error('Please provide a config object')
  }
  !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
  return {
    create,
    login,
    resetPassword,
    obtain,
    createPin
  }
}
