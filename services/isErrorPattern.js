const errorPattern = require('./errorPattern')
const isErrorPattern = (err) => {
  let realQtd = Object.keys(errorPattern())
  let qtd = Object.keys(err).reduce((acc, v) =>
    v.constructor.name === 'String' ? acc + 1 : acc ,0)
  return qtd === realQtd ? true : false
}

module.exports = isErrorPattern
