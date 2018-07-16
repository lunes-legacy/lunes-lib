require('module-alias/register');
const errorPattern  = require('@Services/errorPattern.js');
const unitConverter = require('@Util/unitConverter.js');
const Axios = require('./axios');

const onlyTetherUSTransactions = (array) => {
  if (!array[0].propertyid)
    throw errorPattern('Transaction attribute called propertyid was not found on transaction object',500,'TXHISTORY_ERROR');

  let newArray = array.filter((transaction) => {
    return transaction.propertyid === 31;
  });
  return newArray;
}
const identifyTransactionType = (transactions, address) => {
  return transactions.map((tx) => {
    if (tx.referenceaddress === address)
      tx.type = 'SPENT';
    else if (tx.sendingaddress === address)
      tx.type = 'RECEIVED';
    else
      throw errorPattern('Unknown transaction type',500,'TXHISTORY_ERROR');
    return tx;
  });
}
// [
//   type:
//   otherParams:
//   txid:
//   date:
//   blockHeight:
//   nativeAmount:
//   networkFee:
// ]
const arrangeTransactionsToReturn = (transactions) => {
  return transactions.map((tx) => {
    return {
      type:         tx.type,
      blockHeight:  undefined,
      txid:         tx.txid,
      date:         tx.blocktime,
      nativeAmount: unitConverter.toSatoshi(tx.amount),
      networkFee:   unitConverter.toSatoshi(tx.fee),
      otherParams: {
        propertyid:       tx.propertyid,
        propertyname:     tx.propertyname,
        confirmations:    tx.confirmations,
        sendingaddress:   tx.sendingaddress,
        referenceaddress: tx.referenceaddress }
    }
  });
}
module.exports = async (params) => {
  try {
    if (!params.address)
      throw errorPattern(`Invalid address, got '${params.address}'`);
    if (!params.testnet)
      throw errorPattern(`Invalid testnet parameter, got '${params.testnet}'`);

    let requestParams = new URLSearchParams();
    requestParams.append('addr', params.address);
    requestParams.append('page', 0);

    let result = await Axios.post('/v1/transaction/address', requestParams)
      .catch((e) => {
        let { status, statusText, headers } = e.response;
        if (status !== 200)
          throw errorPattern('Request error',status,'TXHISTORY_ERROR', {statusText, headers});
        throw errorPattern(statusText, status, 'TXHISTORY_ERROR', headers);
      });

    let transactions = result.data.transactions;
    if (transactions instanceof String || typeof transactions === 'string')
      transactions = JSON.parse(transactions);

    transactions = onlyTetherUSTransactions(transactions);
    transactions = identifyTransactionType(transactions, params.address);
    transactions = arrangeTransactionsToReturn(transactions);

    let network = params.network;
    let data    = {
      address: params.address,
      history: transactions
    }

    return {
      network,
      data
    }
  } catch(e) {
    //if this error is already an errorPattern's object, so we return it
    if (e.message && e.status && e.messageKey)
      return e;
    return errorPattern('Error on trying to get transaction history',500,'TXHISTORY_ERROR',e);
  }
}
