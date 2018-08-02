const networks = require('./networks');

const getTaxFrom = (amount) => amount * 0.15
const ADDRESSES = {
  BTC:    '1GnFJzt5Gi4BVfw2qp7hfnFtFtSPANPRVu',
  BCH:    '18xpKzsNjoyLCoNLKWsGaZeV48zmNwAdkp',
  ETH:    '0x7e1a3c9eb123e8b4f9f75c55efe180c8b81ba6b6',
  USDT:   '17UrxYAAF5WkjtFKeuZ2S7ojDWoJY2LunF',
  LTC:    'LWoVdyxbDKfp8dCak97AwYMHpieQFQz6LS',
  DASH:   'XwYgAbqcYiD2rzUGAvJn9bjBRV2DXkQj1o',
  TETHER: '1GnFJzt5Gi4BVfw2qp7hfnFtFtSPANPRVu',
  USDT:   '1GnFJzt5Gi4BVfw2qp7hfnFtFtSPANPRVu',
}

const getOutputTaxFor = (lib, network, amount) => {
  if (typeof network === 'object')
    network = network.coinSymbol.toUpperCase()
  else
    network = network.toUpperCase()

  if (!ADDRESS[network])
    throw errorPattern(`There's no ${network} address to receive tax`);

  if (lib === 'bitcoinjs')
    return { address: ADDRESSES[network], value: getTaxFrom(amount) }
  return {}
}

module.exports = {
  getOutputTaxFor
}
