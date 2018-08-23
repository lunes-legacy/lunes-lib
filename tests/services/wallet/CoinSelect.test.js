const { CoinSelect } = require('../../../services/wallet/Utils/btcFamily/CoinSelect.js')
const { feeEstimator } = require('../../../services/wallet/Utils/btcFamily/FeeEstimator.js')
const balance = require('../../../actions/coins/services/balance.js')
const networks = require('../../../constants/networks.js')
const { lunesFeePercentage } = require('../../../constants/transactionTaxes.js')

function TestDesc() {}
TestDesc.prototype.to = function(to) {
  this.test.result.description = this.test.result.description.replace(this.from, to)
}
TestDesc.prototype.from = function(test, from) {
  this.test = test
  this.from = from
  return this
}
let testDesc = new TestDesc()

let targets = [
  { address:'mzgZH3aFhMTbPZxzNYMsGkCRvx5VWFgTtY', value: (0.0001 * 10**8) },
]
let feePerByte  = 10
let fromAddress = 'mj1oZJa8pphtdjeo51LvEnzxFKHoMcmtFA'
let network     = networks['BTCTESTNET']

test('Should have 1 output of the type change and 1 common', async function() {
  let coinSelect = new CoinSelect(targets, feePerByte, fromAddress, network)
  let result     = await coinSelect.init()
  let changesQtd = 0, commonQtd = 0
  result.outputs.map((output) => {
    if (output.type === 'change')
      changesQtd += 1
    if (output.type === 'common')
      commonQtd += 1
  })
  expect(changesQtd).toBe(1)
  expect(commonQtd).toBe(1)
})

let feeTest = test('Fee have to be equal to ${fee}', async () => {
  testDesc = new TestDesc()
  let coinSelect
             = new CoinSelect(targets, feePerByte, fromAddress, network)
  let result = await coinSelect.init()
  let il     = coinSelect.inputs.length
  let ol     = coinSelect.outputs.length
  console.warn('coinSelect.outputs',coinSelect.outputs)
  let fee    = feeEstimator.set(il, ol, feePerByte).estimate().done('fee')
  testDesc.from(feeTest, '${fee}').to(fee)
  expect(result.fee).toBe(fee)
})


let changeTest = test('Change have to be equal to ${change}', async () => {
  testDesc = new TestDesc()
  let cS     = new CoinSelect(targets, feePerByte, fromAddress, network)
  let result = await cS.init()
  let fee    = feeEstimator
   .set(cS.inputs.length, cS.outputs.length, feePerByte)
    .estimate().done('fee')
  let change = cS.totalInputsAmount - cS.totalOutputsAmount - fee - (fee * lunesFeePercentage)

  testDesc.from(changeTest,'${change}').to(change)
  expect(cS.change).toBe(change)
})


let sendAllBalance = test('Should be fine and should not return any change, returned ${returned}', async () => {
  testDesc = new TestDesc()
  let saldo = await balance('btc','mj1oZJa8pphtdjeo51LvEnzxFKHoMcmtFA', true)
    .then(r => r.data.confirmed)
    .catch(e => { console.log('Received this error from balance func: ',e); return 0; })
  let cS      = new CoinSelect(targets, feePerByte, fromAddress, network)
  let { fee } = await cS.init()

  targets     = [{...targets[0], value: (saldo - fee - (fee * lunesFeePercentage)) }]
  let realCS  = new CoinSelect(targets, feePerByte, fromAddress, network)
  let real = await realCS.init()
  expect(real.outputs).toBeTruthy()
  let changeFound = real.outputs.find(output => output.type === 'change' ? true : false)
  testDesc.from(sendAllBalance, '${returned}').to(changeFound ? 1 : 0)
  expect(changeFound).toBeFalsy()
})
