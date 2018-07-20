const errorPattern = require('./../../errorPattern.js');
const Axios = require('./axios');

const onlyUSDTBalance = (balance) => {
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

  let usdt = onlyUSDTBalance(result.data.balance);

  if (usdt.length < 1)
    throw errorPattern('No one Tether balance was found from this address',500,'BALANCE_ERROR');

  usdt = usdt[0];

  let balance = {
    network: network.coinSymbol.toUpperCase(),
    data: {
      address: address,
      confirmed: usdt.value.toString(),
      unconfirmed: (usdt.pendingpos - usdt.pendingneg).toString()
    }
  };
  return balance;
}
