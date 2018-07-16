require('module-alias/register');
const errorPattern = require('@Services/errorPattern.js');
const Axios = require('./axios');

const onlyTetherBalance = (balance) => {
  return balance.filter((obj) => {
    return obj.symbol.search(/(SP31)/i) !== -1
  });
}

module.exports = async (address, network) => {
  if (!address)
    throw errorPattern(`Got '${address}' from address variable`,500,'BALANCE_ERROR');
  if (!network)
    throw errorPattern(`Got '${network}' from network variable`,500,'BALANCE_ERROR');

  let params = new URLSearchParams();
  params.append('addr', address);

  let result = await Axios.post('/v1/address/addr/', params)
    .catch((e) => {
      let { status, message, messageKey, headers } = e.response;
      if (status !== 200)
        throw errorPattern('Request error', status, 'BALANCE_ERROR', { message, messageKey, headers });

      throw errorPattern(message, status, 'BALANCE_ERROR', {messageKey, headers});
    });

  let tether = onlyTetherBalance(result.data.balance);
  tether = tether[0];

  let balance = {
    network: network.coinSymbol.toUpperCase(),
    data: {
      address: address,
      confirmed: tether.value.toString(),
      unconfirmed: (tether.pendingpos - tether.pendingneg).toString()
    }
  };
  return balance;
}
