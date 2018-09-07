/*|__________________EXAMPLES______________________________|
  const { FeeEstimator } = require('FeeEstimator.js') //it pulls the class
  //const { feeEstimator } = require('FeeEstimator.js') //it pulls the object
  const estimator = new FeeEstimator()

  let fee = estimator.set(1,2,10).estimate().done('fee')
  console.log(fee) // 2250 [Number]

  let fee = estimator.set(1,2,10).estimate().done(['fee','transactionSize'])
  console.log(fee) // {fee: 2250, transactionSize: 225}
*/
function constructor(refer, inputs, outputs, feePerByte) {
  refer.inputsLength  = inputs
  refer.outputsLength = outputs
  refer.transactionSize = 0
  refer.feePerByte    = feePerByte
}
function FeeEstimator(inputs, outputs, feePerByte) {
  constructor(this, inputs, outputs, feePerByte)
}
FeeEstimator.prototype.set = function(inputs, outputs, feePerByte) {
  constructor(this, inputs, outputs, feePerByte)
  return this
}
FeeEstimator.prototype.estimate = function() {
  this.setTransactionSize()
  this.fee = this.transactionSize * this.feePerByte
  return this
}
FeeEstimator.prototype.setTransactionSize = function() {
  let il = this.inputsLength, ol = this.outputsLength
  this.transactionSize = ((il * 146) + (ol * 34) + 10 + il)
  return this
}
FeeEstimator.prototype.done = function(key) {
  let result = {}
  if (!key)
    throw errorPattern(`Key's value is not valid`,0,'FEEESTIMATOR_ERROR')
  if (key.constructor.name === 'Array') {
    key.map(k => {
      result = {
        ...result,
        [k]: this[k]
      }
    }) }
  if (key.constructor.name === 'String' || key.constructor.name === 'Number') {
    result = this[key] }
  return result
}

//In case the people dont wanna to instantiate a new one
const feeEstimator = new FeeEstimator()

module.exports = {
  FeeEstimator,
  feeEstimator
}
