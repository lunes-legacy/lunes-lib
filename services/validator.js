const Validator = require('validator')
const _ = require('lodash')
const moment = require('moment')

const checkBoolean = param => {
  if (typeof param === typeof true) {
    return param
  }
  let result = false
  if (param) {
    result = String(param.toLowerCase()) === 'true'
  }
  return result
}

const validateBody = (body, fields) => {
  const obj = _.pickBy(body, (element, key) => {
    return fields
      ? fields.indexOf(key) !== -1 && element && !Validator.isEmpty(element)
      : element && !Validator.isEmpty(element)
  })
  if (obj.small) {
    obj.avatar = { small: obj.small }
    delete obj.small
  }
  return obj
}

module.exports = {
  isEmail: Validator.isEmail,
  checkRequiredFields: (requiredFields, data) =>
    _.isEqual(requiredFields, _.orderBy(Object.keys(data))),
  isEmpty: Validator.isEmpty,
  checkBoolean,
  validateBody,
  isValidImage: Validator.isBase64,
  isValidDate: date => moment(date, 'DD/MM/YYYY').isValid(),
  getIntersection: _.intersection
}
