const Web3 = require('web3')
const errorPattern = require('../../errorPattern')

module.exports = async (address, network) => {
  let balance = await (new Web3(
    new Web3.providers.HttpProvider(
      network.apiUrl
    )
  )).eth.getBalance(address);

  return {
    network: network.coinSymbol,
    data: {
      address: address,
      confirmed: balance.toString(),
      unconfirmed: null
    }
  };
}