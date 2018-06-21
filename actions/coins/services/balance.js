const validateAddress = require('../util/validateAddress')
const errorPattern = require('../../../services/errorPattern')
const networks = require('../../../constants/networks')

function getNetwork(coin, testnet, object)
{
  if (!object) {
    object = networks;
  }

  var retorno = null;

  Object.keys(object).forEach((key) => {
    var val = object[key];
    if (typeof val.coinSymbol === 'undefined') {
      return findInObject(val);
    } else {
      if (!retorno && val.coinSymbol === coin && val.testnet === testnet) {
        retorno = val;
      }
    }
  });

  return retorno;
}

module.exports = async (coin, address, testnet) => {
  try {
    const network = getNetwork(coin, testnet);

    if (network.coinSymbol.toLowerCase() !== 'lns') {
      if (!validateAddress(address, network.coinSymbol, network.testnet)) {
        throw errorPattern(
          'Invalid ' + network.coinName + ' Address',
          406,
          'ADDRESS_INVALID',
          'The address ' +
            address +
            ' is not a valid ' +
            network.coinName +
            ' address.'
        )
      }
    }
    const balance = require('./../../../services/wallet/'+network.coinSymbol.toLowerCase()+'/balance');

    return balance(address, network);
  } catch (error) {
    throw errorPattern(
      error.message || 'Error retrieving balance',
      error.status || 500,
      error.messageKey || 'BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}