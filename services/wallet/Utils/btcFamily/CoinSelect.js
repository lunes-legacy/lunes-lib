const axios = require('axios')
const { feeEstimator } = require('./FeeEstimator.js')

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
}
this.acomulateIndex = 0
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
    if (utxo.value >= this.totalOutputsAmount) {
      this.inputs.push(utxo)
      return false
    }
  }
  if (this.inputs < 1)
    return false
  else
    return true
}
CoinSelect.prototype._acomulateFromTheLast = function() {
  console.log('called function _acom....', this.acomulated.index, this.utxos.length)
  console.log('\n\n\n',this.utxos,'\n\n\n')
  if (this.acomulated.index >= this.utxos.length) {
    throw errorPattern('Theres no enough unspent transaction to pay the fees')
  }
  while (this.acomulated.index <= this.outputs.length) {
    console.log('_acomulateFromTheLast::___', this.acomulated)
    let output = this.outputs[index]
    this.acomulated.index++
  }
}
/**
 * Iterates through utxos until hit the total amount
 * @return {}
 */
CoinSelect.prototype.acomulate = function(fromTheLast = false){
  if (fromTheLast)
    return this._acomulateFromTheLast()
  for (let utxo of this.utxos) {
    this.calculateFee()
    this.calculateChange()
    //if we have enough funds to this transaction
    if (this.acomulated.amount >= this.totalOutputsAmount + this.fee) return true; //we end it
    this.inputs.push(utxo)
    this.acomulated.index++
    this.acomulated.amount += utxo.value
  }
  if (this.acomulated.amount < this.totalOutputsAmount + this.fee)
    return false
  return true
}


// CoinSelect.prototype.makeInputs  = function() {
//   console.log('this.inputs',this.inputs)
//   this.utxos.map(utxo => {
//     this.inputs.push({...utxo})
//   })
// }
CoinSelect.prototype.makeOutputs = function() {
  this.targets.map(target => {
    this.outputs.push({...target, type: 'common'})
  })
  if (this.change > 0) {
    this.outputs.push({address: this.address, value: 0, type: 'change'})
  }
  this.calculateFee()
  this.calculateChange()
  this.verifyChangeOutput()
}

CoinSelect.prototype.calculateFee = function(){
  this.fee = feeEstimator
   .set(this.inputs.length, this.targets.length, this.feePerByte)
    .estimate()
     .done('fee')
}

CoinSelect.prototype.calculateChange = function(){
  //every time that we are going to calculate the fee, we need to zero
  //the totalInputsAmount
  this.totalInputsAmount = 0
  this.inputs.map(input => { this.totalInputsAmount += input.value })
  this.change = this.totalInputsAmount - this.totalOutputsAmount - this.fee
}
/**
 * This function get the change output, parse from 0 to the right change
 *   Im not goin to explain why should be that way
 * @return {}
 */
 CoinSelect.prototype.verifyChangeOutput = async function(){
  this.outputs = this.outputs.map(output => {
    if (output.type === 'change') {
      if (this.change > 0)
        return { ...output, value: this.change }
      else
        return undefined
    } else {
      return output
    }
  })
  this.outputs = this.outputs.filter(e => e ? true : false)
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
    console.log('acomulate1:',accomplished)
    if (!accomplished) //if we couldnt chooseOne and acomulate, theres no inputs
      return this.errorObject
    let totalInputsAmount = 0, totalOutputsAmount = 0
    this.inputs.map(input => { totalInputsAmount += input.value })
    this.targets.map(output => output.type !== 'change' ? totalOutputsAmount += output.value : 0 )
    this.calculateFee()
    this.calculateChange()
    console.log('_____1',totalInputsAmount, totalOutputsAmount, this.change, this.fee)
    //if the rest, dont pay the calculated fees
    if ((totalInputsAmount - totalOutputsAmount) < this.fee) {
      console.log('____2', this.change, this.fee)
      this.acomulate(true)
    }
  }
  this.calculateFee()
  this.calculateChange()
  // this.makeInputs()
  this.makeOutputs()
  // console.log('__________________________________________')
  // console.log('fee________:', this.fee)
  // console.log('change_____:', this.change)
  // console.log('outputs____:', this.outputs,'\n')
  // console.log('inputs_____:', this.inputs)
  // console.log('__________________________________________')
  return { inputs: this.inputs, outputs: this.outputs, fee: this.fee }
}

module.exports = {
  CoinSelect: CoinSelect
}
