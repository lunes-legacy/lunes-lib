const Axios = require('./axios.js');
const getUnsignedTransaction = require('./getUnsignedTransaction.js');
const decodeHexTransaction   = require('./decodeHexTransaction.js');
const BtctWallet = require('./../btc/wallet.js');
const networks = require('./../../../constants/networks.js')
const errorPattern = require('./../../errorPattern.js');

  // if (decoded instanceof Array)
  //   throw errorPattern(`Param 'decoded' is an array`,500,'ESTIMATEFEE_ERROR');
  // if (!(decoded instanceof Object))
  //   throw errorPattern(`Got ${decoded} in 'decoded' param`,500,'ESTIMATEFEE_ERROR');
  // if (!decoded.BTC)
  //   throw errorPattern(`BTC attribute was not found in param 'decoded'`,500,'ESTIMATEFEE_ERROR');
  // if (!decoded.BTC.vin || !decoded.BTC.vout)
  //   throw errorPattern(`vout or vin attributes were not found in decoded's attribute BTC`,500,'ESTIMATEFEE_ERROR');
  // if (decoded.BTC.vin.length < 1 || decoded.BTC.vout.length < 1)
  //   throw errorPattern(`Not enough number of inputs or outputs`,500,'ESTIMATEFEE_ERROR');
// const estimateFee = (decoded, feePerByte) => {
const estimateFee = async (params) => {
  const { toAddress, mnemonic } = params
  const keyPair = BtctWallet.mnemonicToKeyPair(mnemonic, networks['BTC'])

  const transactionAmount = Number(params.amount)
  const feePerByte = Number(params.feePerByte)

  params = {
    ...params,
    pubKey: keyPair.getPublicKeyBuffer().toString('hex'),
    transactionAmount: (params.amount / 10**8).toFixed(8),
    fee:   (5000 / 10**8).toFixed(8),
    feePerByte
  }

  let unsignedhex = await getUnsignedTransaction(params)
  .catch(e => { throw errorPattern(e.error || 'Failed to get unsigned transaction', e.status || 500, 'ESTIMATEFEE_ERROR') })
  .then(e => {
    let { error, unsignedhex } = e;
    if (error)
      throw errorPattern(`Failed to get unsigned transaction. Explorer error message: ${error}`, 500, 'ESTIMATEFEE_ERROR');
    if (!unsignedhex)
      throw errorPattern(`Estimate's unsiged hex is not valid, got ${unsignedhex}`,500,'ESTIMATEFEE_ERROR');
    return unsignedhex;
  });
  let decoded      = await decodeHexTransaction(unsignedhex)
  .then(r => r.data)
  .catch(e => {
    let { status, statusText, header } = e.response;
    throw errorPattern(`Erro on trying to decode transaction. Explorer status text: ${statusText}`, status || 500, 'ESTIMATEFEE_ERROR')
  });

  if (decoded instanceof Array)
    throw errorPattern(`Param 'decoded' is an array`,500,'ESTIMATEFEE_ERROR');
  if (!(decoded instanceof Object))
    throw errorPattern(`Got ${typeof decoded} in 'decoded' param`,500,'ESTIMATEFEE_ERROR');
  if (!decoded.BTC)
    throw errorPattern(`BTC attribute was not found in param 'decoded'`,500,'ESTIMATEFEE_ERROR');
  if (!decoded.BTC.vin || !decoded.BTC.vout)
    throw errorPattern(`vout or vin attributes were not found in decoded's attribute BTC`,500,'ESTIMATEFEE_ERROR');
  if (decoded.BTC.vin.length < 1 || decoded.BTC.vout.length < 1)
    throw errorPattern(`Not enough number of inputs or outputs`,500,'ESTIMATEFEE_ERROR');


  // console.log(decoded); return;
  let inputs       = decoded.BTC.vin.length;
  let outputs      = decoded.BTC.vout.length;
  let inputSize    = 148;
  let outputSize   = 34;
  let txSize       = (inputs * inputSize) + (outputs * outputSize) + 10 + (inputs/2); //in bytes
  let estimatedFee = parseInt(txSize * feePerByte);
  return estimatedFee;
}

module.exports = estimateFee;

