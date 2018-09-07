const networks = require('./networks');

const lunesFeePercentage = 0.2
const getTaxFrom = (amount) => amount * lunesFeePercentage
const ADDRESSES = {
  LUNES:  '37zs8HvLx8p52EiNXyDSCk7hQYtan4fAW6c',
  BTC:    '1MycTYF1haUQZXkK2WVbr9YuJ8ixh2WpQ3',
  BCH:    '1BNKsChBd3SPejTnoHiBEMGgktP8CNPFtw',
  ETH:    '0xe872c69376d66357202637d6bc81c137d69271ca',
  LTC:    'LcffvJPwviuESTw1vQicQ2nayWvRu23Eta',
  USDT:   '1MycTYF1haUQZXkK2WVbr9YuJ8ixh2WpQ3',
  DASH:   'XpngUBj4duoKGmpBiJNPjPpmQuMFGkoaGg',
}
const TESTADDRESSES = {
  LUNES: '37dAVxk6G5jgBbcAHDv1RThcu4AEhhGJXHo',
  BTC:   'mw3m9ZwSydi1zHZehBZRVdRRHGMjLPDwHv',
  BCH:   'mw3m9ZwSydi1zHZehBZRVdRRHGMjLPDwHv',
  ETH:   '0xe6bf40e081edb415e3ed0f68691b3e11c64cd6ce',
  LTC:   'mw3m9ZwSydi1zHZehBZRVdRRHGMjLPDwHv',
  USDT:  'mw3m9ZwSydi1zHZehBZRVdRRHGMjLPDwHv',
  DASH:  'ybrFhiaoZs9RhrcAQMDfZGKEXtq629b7LT',
}

//amount [String/Number] (Satoshi)
//lib [String] 'bitcoinjs'
const getOutputTaxFor = (lib, network, amount) => {
  if (network && network.constructor.name === 'String')
    network = networks[network.toUpperCase()]
  if (!network)
    throw errorPattern('Network param is missing')

  let testnet = network.testnet
  let symbol = network.coinSymbol

  if (testnet) {
    if (!TESTADDRESSES[symbol])
      throw errorPattern(`There's no ${network} address to receive tax`);
    if (lib === 'bitcoinjs')
      return { address: TESTADDRESSES[symbol], value: getTaxFrom(amount) }
  } else {
    if (!ADDRESSES[symbol])
      throw errorPattern(`There's no ${network} address to receive tax`);
    if (lib === 'bitcoinjs')
      return { address: ADDRESSES[symbol], value: getTaxFrom(amount) }
  }
  return {}
}

module.exports = {
  getOutputTaxFor,
  lunesFeePercentage
}
