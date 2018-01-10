const Validator = require('validator')

const DEFAULT_PASSWORD_LENGTH = 8

module.exports = {
  isEmail: Validator.isEmail,
  areNotEmpty: fields => fields.filter(Validator.isEmpty).length !== fields.length,
  isValidPassword: (password) => password.length >= DEFAULT_PASSWORD_LENGTH
}
