const Axios = require('./axios');

module.exports = async (address, network) => {
  let params = new URLSearchParams();
  params.append('addr', address);
  let result = await Axios.post('/v1/address/addr/', params);
  let tether = result.data.balance.filter((obj) => {
    return obj.symbol === 'SP31';
  });
  tether = tether[0];
  // tether.pendingpos = '10000000';
  // tether.pendingneg = '100000000';
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
