const Web3 = require('web3')
const errorPattern = require('../../errorPattern')

module.exports = async (address, network) => {
  try {
    return (new Web3(
      new Web3.providers.HttpProvider(
        network.apiUrl
      )
    )).eth.getBalance(address);
  } catch (error) {
    throw errorPattern(
      error.message || 'Error retrieving balances',
      error.status || 500,
      error.messageKey || 'BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}