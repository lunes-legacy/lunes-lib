const Axios = require('./axios.js');
/**
 * Spend value from a keyPair wallet
 *
 * @param {Hex(String)} pubKey - Sender's public key
 * @param {String}      toAddress - Address to send the transaction
 * @param {Number}      transactionAmount - Amount to send in satoshis unit - Ex: 50000
 * @param {Number}      feePerByte - Fee per byte to use in satoshis unit - Ex: 32
 * @param {Bool}        testnet -

 * @return {

  }
 */
const getUnsignedTransaction = async (data) => {
  let { pubKey, fromAddress, toAddress, transactionAmount, fee, testnet } = data;
  let params = new URLSearchParams;
  params.append('transaction_version',1);
  params.append('currency_identifier',31);
  params.append('fee',fee);
  params.append('testnet',testnet);
  params.append('pubkey',pubKey);
  params.append('amount_to_transfer',transactionAmount);
  params.append('transaction_from',fromAddress);
  params.append('transaction_to',toAddress);
  return await Axios.post('/v1/transaction/getunsigned/0', params)
  .then(e => e.data)
  // .catch(e => errorPattern('Error on trying to get unsigned transaction',500,'GETUNSIGNEDTRANSACTION_ERROR',e));
}

module.exports = getUnsignedTransaction;
