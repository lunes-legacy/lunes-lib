const Validator = require('validator')
const {PASSWORD_LENGTH, MAX_PIN_VALUE} = require('../../constants/defaultLengths')
module.exports = {
  isEmail: Validator.isEmail,
  areNotEmpty: fields => fields.filter(Validator.isEmpty).length !== fields.length,
  isValidPassword: (password) => password.length >= PASSWORD_LENGTH,
  isPIN: (pin) => Validator.isInt(pin, {min: 0, max: MAX_PIN_VALUE})
}
