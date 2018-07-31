const axios = require('axios')
const errorPattern = require('./../../../services/errorPattern.js');


const endpoint = `${require('../../../constants/api')}/coins/tx/estimate`
const USDTEstimate = require('./../../../services/wallet/usdt/estimateFee.js');
/**
 * Estimate transaction fee for given parameters
 *
 * BtcFamily:
 * @param transactionData = {
      {String} network - coin network
      {Boolean} testnet - if is testnet network
      {String} toAddress - Address to send the transaction
      {String} fromAddress - Address sending the transaction
      {String} amount - Amount to send in satoshi unit - Ex: 5000000 (0.05 BTC)
      {String} feePerByte - Fee per byte to use in satoshi unit - Ex: 32 (0.00000032 BTC)
 * }
 *
 * Ethereum:
 * @param transactionData = {
      {String} network - coin network
      {Boolean} testnet - if is testnet network
      {String} toAddress - Address to send the transaction
      {String} fromAddress - Address sending the transaction
      {String} amount - Amount to send in wei unit - Ex: 1500000000000000 (0.0015 ETH)
      {String} gasLimit - Gas limit to use - Ex: 21000
      {String} gasPrice - Gas price to use in wei unit - Ex: 10000000000 (10 Gwei)
 * }
 *
 * Lunes: NOT SUPPORTED
 *
 * @param accessToken - user's accessToken for authentication
 *
 * BtcFamily:
 * @return fee in satoshi unit
      network:
      data: {
        fee:
      }
 *
 * Ethereum:
 * @return fee in wei unit
      network:
      data: {
        txFee:
        gasPrice:
        gasLimit:
      }
 */
module.exports = async (transactionData, accessToken) => {
  try {
    if (transactionData.network.search(/(usdt)/i) !== -1) {
      return await USDTEstimate(transactionData)
        .catch(e => {
          if ("message" in e)
            throw e;
          throw errorPattern(`Error returned was not an error pattern`,500,'ESTIAMTEFEE_ERROR',e);
        })
        .then(r => {
          if (typeof r !== 'number')
            throw errorPattern(`Error on trying to get an estimation for this adress, got '${r}' from variable 'r' inside .then()`,500,'ESTIAMTEFEE_ERROR');
          if (typeof r === 'object' && Object.keys(r).indexOf('message') !== -1)
            throw r;
          return {
            network: transactionData.network.toUpperCase(),
            data: { fee: r }
          }
        })
    }
    const headers = { Authorization: `Bearer ${accessToken}` }
    const res = await axios.post(endpoint, transactionData, { headers })
    return res.data
  } catch (err) {
    // throw err.response ? err.response.data : new Error(err)
    return err.response ? err.response.data : err
  }
}
