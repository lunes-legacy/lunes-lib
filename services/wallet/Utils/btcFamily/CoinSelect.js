const axios = require('axios')
const { feeEstimator } = require('./FeeEstimator.js')
const errorPattern = require('./../../../errorPattern.js')
const { getOutputTaxFor, lunesFeePercentage } = require('./../../../../constants/transactionTaxes.js')

function CoinSelect(targets, feePerByte, address, network) {
  this.network     = network
  this.errorObject = {outputs: undefined, inputs: undefined, fee: undefined}
  this.tmpUtxos    = [] //it will comes from the lunes-server ecl
  this.utxos       = [] //prepared to use utxos
  this.targets     = targets
  this.feePerByte  = feePerByte
  this.fee         = 0
  this.totalOutputsAmount = 0
  this.totalInputsAmount  = 0
  this.address     = address
  this.inputs      = []
  this.outputs     = []
  this.change      = 0
  this.acomulated  = {index:0, amount:0}
  this.lunesFee    = 0
}

CoinSelect.prototype.getUtxos = async function() {
  const endpoint = `${require('../../../../constants/api')}/coins/transaction`

  let url = `${endpoint}/${this.network.coinSymbol}/findUTXOs/${this.address}?testnet=${
    this.network.testnet
  }`

  this.tmpUtxos = await axios.get(url).then(r => r.data)
}
// Convert it
// { tx_hash:'', tx_pos: 0, height: 0, value: 0 }
// to it
// {txid:'',vout:1,value:123}
CoinSelect.prototype.arrangeUtxos = function() {
  let tmpUtxos = this.tmpUtxos
  for (let tmpUtxo of tmpUtxos) {
    if (tmpUtxo.height < 1) continue
    this.utxos.push({
      txid: tmpUtxo.tx_hash,
      vout: tmpUtxo.tx_pos,
      value: tmpUtxo.value
    })
  }
}
CoinSelect.prototype.calculateFinalAmount = function() {
  this.finalAmount = parseInt(this.totalOutputsAmount + this.fee + (this.lunesFee))
}
CoinSelect.prototype.calculateAmountToSend = function() {
    this.totalOutputsAmount = 0
    for (let target of this.targets) {
      let val = target.value
      if (!val)
        val = 0
      if (val.constructor.name !== 'Number')
        val = parseInt(val)
      if (target.value > 0)
        this.totalOutputsAmount += val
    }
    //TODO review it
    //the fee wasnt calculated yet, this is why it is commented
    // this.totalOutputsAmount += (this.fee * lunesFeePercentage)
}
/**
 * Sort the array of utxos ascendantly by value
 * @return {}
 */
CoinSelect.prototype.sort = function(inverted = false) {
  let utxos   = this.utxos
  this.utxos = this.utxos.sort((a,b) => {
    if (inverted)
      return b.value - a.value
    else
      return a.value - b.value
  })
}
/**
 * Choose only one input to not pay so much fee, if does not have a good
 *   output to spent, we skip it.
 * @return {}
 */
CoinSelect.prototype.chooseOne = function() {
  let utxos = this.utxos
  for (let utxo of utxos) {
    this.inputs.push(utxo)
    this.calculateFee(true, this._isGonnaHaveChange())
    this.calculateFinalAmount()
    this.calculateChange(true)
    if (utxo.value < this.finalAmount) {
      this.inputs = []
      continue
    }
    if (this.inputs.length > 0)
      break
  }
  if (this.inputs < 1) {
    this.inputs = []
    return false
  } else {
    return true }
}

CoinSelect.prototype._verifyAcomulateErrors = function() {
  let { amount, index } = this.acomulated
  let sending = this.totalOutputsAmount
  let finalAmount = this.finalAmount
  //those conditional is just to identify the error
  if (amount < sending) {
    throw errorPattern(`Insufficient funds, have '${amount}', but you're trying to send ${sending}`,0,'COINSELECT_ACOMULATE')
  } else if ((amount >= sending) && (amount < finalAmount)) {
    throw errorPattern(`Insufficient funds to pay the fees, have '${amount}', fee got '${this.fee}', lunes fee '${this.lunesFee}' sending '${sending}', total '${finalAmount}'`,0,'COINSELECT_ACOMULATE')
  }
}

CoinSelect.prototype._isGonnaHaveChange = function(){
  this.calculateFinalAmount()
  this.calculateChange()
  return this.change > 0 ? true : false
}

/**
 * Iterates through utxos until hit the total amount
 * @return {}
 */
CoinSelect.prototype.acomulate = function(fromTheLast = false){
  // if (fromTheLast)
    // return this._acomulateFromTheLast()
  let toa = this.totalOutputsAmount
  for (let utxo of this.utxos) {
    this.inputs.push(utxo)
    this.acomulated.index = this.inputs.length - 1
    this.acomulated.amount += utxo.value
    this.calculateFee(true, this._isGonnaHaveChange())
    this.calculateFinalAmount()
    this.calculateChange(true)
    this.makeOutputs()

    //the sending amount + fee + lunesFee
    if (this.acomulated.amount >= this.finalAmount) return true; //we end it
  }
  //less than value which the user wanna send
  if (this.acomulated.amount < this.finalAmount) {
    this._verifyAcomulateErrors()
    //if doesnt throw any error
    return false
  }
  return true
}


CoinSelect.prototype.makeOutputs = function() {
  this.outputs = []
  this.targets.map(target => {
    this.outputs.push({...target, type: 'common'})
  })
  if (this.fee > 0) { //output
    const output = getOutputTaxFor('bitcoinjs', this.network, this.fee)
    this.outputs.push({ address: output.address, value: parseInt(output.value), type: 'lunes-tax' })
  }
  if (this.change > 0) {
    this.outputs.push({address: this.address, value: this.change, type: 'change'})
  }
}

/**
 * No commentary
 * @param  {Boolean} [calculateOutputTaxToo=false] Predicts if is gonna have outputtax
 * @param  {Boolean} [calculateChangeToo=false]    Predicts if is gonna have outputchange
 * @return {}
 */
CoinSelect.prototype.calculateFee = function(calculateOutputTaxToo = false, calculateChangeToo = false){
  let ol = calculateOutputTaxToo ? this.targets.length + 1 : this.targets.length //outputs length
  ol = calculateChangeToo ? ol + 1 : ol
  this.fee = feeEstimator
   .set(this.inputs.length, ol, this.feePerByte)
    .estimate()
     .done('fee')
  this.lunesFee = parseInt(this.fee * lunesFeePercentage)
}
/**
 * [description]
 * @param  {Boolean} [calculateOutputTaxToo=false]
 * @return {}
 */
CoinSelect.prototype.calculateChange = function(calculateOutputTaxToo = false){
  //every time that we are going to calculate the fee, we need to zero
  //the totalInputsAmount
  this.totalInputsAmount = 0
  this.inputs.map(input => { this.totalInputsAmount += input.value })
  if (calculateOutputTaxToo) {
    let outputTax = this.outputs.find(output => output.type === 'lunes-tax' ? true : false)
    this.change = this.totalInputsAmount - this.finalAmount
  } else {
    this.change = this.totalInputsAmount - this.finalAmount
  }
}

CoinSelect.prototype.init = async function() {
  await this.getUtxos() //stores at tmpUtxos
  this.arrangeUtxos() //stores at utxos
  if (this.utxos.length < 1) return this.errorObject
  this.sort() //no params passed, doing ascendant
  this.calculateAmountToSend() //stores at totalOutputsAmount
  let accomplished = this.chooseOne()
  if (!accomplished) {
    this.inputs = [] //clear the inputs in case the old function have already get some inputs
    this.sort(true) //true stands for descending/inverted order
    accomplished = this.acomulate()
    //In case of error, probably will throw it,
    //but in case it return boolean:
    if (!accomplished) //if we couldnt chooseOne and acomulate, theres no inputs
      return this.errorObject
  }
  this.makeOutputs()

  return { inputs: this.inputs, outputs: this.outputs, fee: this.fee }
}

module.exports = {
  CoinSelect: CoinSelect
}
