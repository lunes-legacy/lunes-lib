const networks = require('./networks');

const getTaxFrom = (amount) => amount * 0.15
const ADDRESSES = {
  BTC: '17UrxYAAF5WkjtFKeuZ2S7ojDWoJY2LunF',
  ETH: '0xe351e8aaa9715c4a33e2d2c7a34ca015492c1f5e',
  USDT: '17UrxYAAF5WkjtFKeuZ2S7ojDWoJY2LunF',
  LTC: 'Lc1ujcsXrKZ1wsBKod3vJJrhNH1U2niNDR',
  DASH: 'XcZYxWiVjbYKqpT1orEhTum8iuRsAvjtmv',
}

const getOutputTaxFor = (lib, network, amount) => {
  if (typeof network === 'object')
    network = network.coinSymbol.toUpperCase()
  else
    network = network.toUpperCase()

  if (lib === 'bitcoinjs')
    return { address: ADDRESSES[network], value: getTaxFrom(amount) }
  return {}
}

module.exports = {
  getOutputTaxFor
}
