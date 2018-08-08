const networks = require('./networks');

const getTaxFrom = (amount) => amount * 0.2
const ADDRESSES = {
  BTC:    '1GnFJzt5Gi4BVfw2qp7hfnFtFtSPANPRVu',
  BCH:    '18xpKzsNjoyLCoNLKWsGaZeV48zmNwAdkp',
  ETH:    '0x7e1a3c9eb123e8b4f9f75c55efe180c8b81ba6b6',
  LTC:    'LWoVdyxbDKfp8dCak97AwYMHpieQFQz6LS',
  DASH:   'XwYgAbqcYiD2rzUGAvJn9bjBRV2DXkQj1o',
  USDT:   '1GnFJzt5Gi4BVfw2qp7hfnFtFtSPANPRVu',
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
