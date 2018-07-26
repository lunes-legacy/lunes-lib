const Axios                  = require('./axios.js');
const getUnsignedTransaction = require('./getUnsignedTransaction.js');
const decodeHexTransaction   = require('./decodeHexTransaction.js');
const BtctWallet             = require('./../btc/wallet.js');
const networks               = require('./../../../constants/networks.js')
const errorPattern           = require('./../../errorPattern.js');
const bitcoinjs              = require('bitcoinjs-lib');

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

  let decoded  = bitcoinjs.Transaction.fromHex(unsignedhex);

  if (decoded instanceof Array)
    throw errorPattern(`Param 'decoded' is an array`,500,'ESTIMATEFEE_ERROR');
  if (!(decoded instanceof Object))
    throw errorPattern(`Got ${typeof decoded} in 'decoded' param`,500,'ESTIMATEFEE_ERROR');
  if (!decoded.ins || !decoded.outs)
    throw errorPattern(`ins or outs attributes were not found in decoded's attribute BTC`,500,'ESTIMATEFEE_ERROR');
  if (decoded.ins < 1 || decoded.outs < 1)
    throw errorPattern(`Not enough number of inputs or outputs`,500,'ESTIMATEFEE_ERROR');

  let inputs       = decoded.ins.length;
  let outputs      = decoded.outs.length;
  let inputSize    = 148;
  let outputSize   = 34;
  let txSize       = (inputs * inputSize) + (outputs * outputSize) + 10 + (inputs/2); //in bytes
  let estimatedFee = parseInt(txSize * feePerByte);
  return estimatedFee;
}

module.exports = estimateFee;

