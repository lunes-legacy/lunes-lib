const Axios                  = require('./axios.js');
const getUnsignedTransaction = require('./getUnsignedTransaction.js');
const decodeHexTransaction   = require('./decodeHexTransaction.js');
const BtctWallet             = require('./../btc/wallet.js');
const networks               = require('./../../../constants/networks.js')
const errorPattern           = require('./../../errorPattern.js');
const bitcoinjs              = require('bitcoinjs-lib');
const unit                   = require('./../../../actions/coins/util/unitConverter.js');
/*
  params: {
    fee:                estimatedFee (satoshi),
    testnet:            network.testnet (boolean),
    transactionAmount:  amount (satoshi),
    pubKey,
    toAddress,
    fromAddress,
  }
*/
const estimateFee = async (params) => {
  // const { toAddress, mnemonic } = params
  // const keyPair = BtctWallet.mnemonicToKeyPair(mnemonic, networks['BTC'])
  const transactionAmount = unit.toBitcoin(params.amount)
  const feePerByte = Number(params.feePerByte)

  params = {
    ...params,
    transactionAmount, //(BTC value)
    fee: unit.toBitcoin(5000) // (BTC value)
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
    throw errorPattern(`Variable 'decoded' is an array`,500,'ESTIMATEFEE_ERROR');
  if (!(decoded instanceof Object))
    throw errorPattern(`Got ${typeof decoded} from 'decoded' variable`,500,'ESTIMATEFEE_ERROR');
  if (!decoded.ins || !decoded.outs)
    throw errorPattern(`ins or outs attributes were not found in decoded's attribute BTC`,500,'ESTIMATEFEE_ERROR');
  if (decoded.ins < 1 || decoded.outs < 1)
    throw errorPattern(`Not enough number of inputs or outputs`,500,'ESTIMATEFEE_ERROR');


  let inputs       = decoded.ins.length;
  console.log('inputs',inputs);
  let outputs      = decoded.outs.length + 1; //+ 1 to the output tax <<
  console.log('outputs',outputs);
  let inputSize    = 148;
  let outputSize   = 34;
  let txSize       = (inputs * inputSize) + (outputs * outputSize) + 10 + (inputs/2); //in bytes
  console.log('txSize',txSize);
  let estimatedFee = parseInt(txSize * feePerByte);
  console.log('estimatedFee',estimatedFee);
  return estimatedFee;
}

module.exports = estimateFee;

