const { CoinSelect } = require('../../../services/wallet/Utils/btcFamily/CoinSelect.js')
const { feeEstimator } = require('../../../services/wallet/Utils/btcFamily/FeeEstimator.js')
const networks = require('../../../constants/networks.js')

const testDesc = {
  to: function(to) {
    this.test.result.description = this.test.result.description.replace(this.from, to)
  },
  from: function(test, from) {
    this.test = test
    this.from = from
    return this
  },
}

let targets = [
  { address:'mzgZH3aFhMTbPZxzNYMsGkCRvx5VWFgTtY', value: (0.0001 * 10**8) },
]
let feePerByte  = 10
let fromAddress = 'mj1oZJa8pphtdjeo51LvEnzxFKHoMcmtFA'
let network     = networks['BTCTESTNET']

test('Should have 1 output of the type change and 1 common', async () => {
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
  let coinSelect
             = new CoinSelect(targets, feePerByte, fromAddress, network)
  let result = await coinSelect.init()
  let il     = coinSelect.inputs.length
  let ol     = coinSelect.outputs.length
  let fee    = feeEstimator.set(il, ol, feePerByte).estimate().done('fee')
  feeTest.result.description = feeTest.description.replace('${fee}', fee)
  expect(result.fee).toBe(fee)
})

let changeTest = test('Change have to be equal to ${change}', async () => {
  let cS     = new CoinSelect(targets, feePerByte, fromAddress, network)
  let result = await cS.init()
  let fee    = feeEstimator
   .set(cS.inputs.length, cS.outputs.length, feePerByte)
    .estimate().done('fee')
  let change = cS.totalInputsAmount - cS.totalOutputsAmount - fee

  testDesc.from(changeTest,'${change}').to(change)
  expect(cS.change).toBe(change)
})
