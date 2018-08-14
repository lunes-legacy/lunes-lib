const networks = require('./networks');

const getTaxFrom = (amount) => amount * 0.2
const ADDRESSES = {
  LUNES:  '37zs8HvLx8p52EiNXyDSCk7hQYtan4fAW6c',
  BTC:    '1MycTYF1haUQZXkK2WVbr9YuJ8ixh2WpQ3',
  BCH:    '1BNKsChBd3SPejTnoHiBEMGgktP8CNPFtw',
  ETH:    '0xe872c69376d66357202637d6bc81c137d69271ca',
  LTC:    'LcffvJPwviuESTw1vQicQ2nayWvRu23Eta',
  USDT:   '1MycTYF1haUQZXkK2WVbr9YuJ8ixh2WpQ3',
  DASH:   'XpngUBj4duoKGmpBiJNPjPpmQuMFGkoaGg',
}

//amount [String/Number] (Satoshi)
//lib [String] 'bitcoinjs'
const getOutputTaxFor = (lib, network, amount) => {
  if (typeof network === 'object')
    network = network.coinSymbol.toUpperCase()
  else
    network = network.toUpperCase()

  if (!ADDRESSES[network])
    throw errorPattern(`There's no ${network} address to receive tax`);

  if (lib === 'bitcoinjs')
    return { address: ADDRESSES[network], value: getTaxFrom(amount) }
  return {}
}

module.exports = {
  getOutputTaxFor
}
