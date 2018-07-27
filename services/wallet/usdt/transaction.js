const bitcoinjs    = require('bitcoinjs-lib')
const coinSelect   = require('coinselect')
const errorPattern = require('../../errorPattern')
//const UsdtWallet   = require('./wallet')
const BtctWallet   = require('./../btc/wallet')
// const ElectrumAPI = require('./api/electrumApi')
//Should be removed
const networks = require('./../../../constants/networks.js');
//Should be removed
const ValidateAddress = require('../validateAddress')
const Axios = require('./axios')
const unitConverter = require('./../../../actions/coins/util/unitConverter.js');

// const estimateFee            = require('./../../../actions/coins/services/estimateFee.js');
const estimateFee            = require('./estimateFee.js');
const login            = require('./../../../actions/users/login.js');
const getUnsignedTransaction = require('./getUnsignedTransaction.js');
const decodeHexTransaction   = require('./decodeHexTransaction.js');
const { getOutputTaxFor }    = require("./../../../constants/transactionTaxes.js");
// const estimateFee            = require('./estimateFee.js');

/**
 * Create and send a transaction for given parameters
 *
 * @param transactionData = {
      {String} mnemonic - to create the seed for an address
      {String} toAddress - Address to send the transaction
      {String} amount - Amount to send in satoshi unit - Ex: 5000000 (0.05 BTC)
      {String} feePerByte - Fee per byte to use in satoshi unit - Ex: 32 (0.00000032 BTC)
 * }
 * @param {BtcNetworks} network - Bitcoin Network
 *
 * @return the transaction id
      network:
      data: {
        txID:
      }
 */


const startUserTransaction = async (transactionData, network) => {
  try {
    const { toAddress, mnemonic } = transactionData
    // TODO this line below should be uncommented
    // const keyPair = UsdtWallet.mnemonicToKeyPair(mnemonic, network)
    //TODO this line below should be removed in order to generate a different addres to BTC
    const keyPair = BtctWallet.mnemonicToKeyPair(mnemonic, networks['BTC'])

    const transactionAmount = Number(transactionData.amount)
    const feePerByte = Number(transactionData.feePerByte)

    const result = await createTransaction(
      keyPair,
      toAddress,
      transactionAmount,
      feePerByte,
      network
    )

    return result
  } catch (error) {
    //TODO: remove this console and return <<<
    // console.log(error);return
    throw errorPattern(
      error.message || 'Error startUserTransaction',
      error.status || 500,
      error.messageKey || 'START_USER_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

/**
 * Spend value from a keyPair wallet
 *
 * @param {ECPair} keyPair - bitcoinjs-lib's keypair of wallet to send the transaction from
 * @param {String} toAddress - Address to send the transaction
 * @param {Number} transactionAmount - Amount to send in satoshis unit - Ex: 50000
 * @param {Number} feePerByte - Fee per byte to use in satoshis unit - Ex: 32
 * @param {BtcNetworks} network - Bitcoin Network

 * @return the transaction id
      network:
      data: {
        txID:
      }
 */
const createTransaction = async (
  keyPair,
  toAddress,
  transactionAmount,
  feePerByte,
  network
) => {
  try {
    // TODO remove it just when the code gets into production
    // console.log(`=== Starting ${network.coinSymbol} transaction ===`);
    // console.log(`__________________________________________`);
    // // console.log(`Mnemonic____: ${mnemonic}`);
    // console.log(`From________: ${keyPair.getAddress()}`);
    // console.log(`To__________: ${toAddress}`);
    // console.log(`Amount______: ${transactionAmount} (satoshi)`);
    // console.log(`Testnet?____: ${network.testnet} (satoshi)`);
    // console.log(`FeePerByte__: ${feePerByte} (satoshi)`);


    let pubKey   = keyPair.getPublicKeyBuffer().toString('hex'),
    fromAddress  = keyPair.getAddress(),
    taxOutput    = getOutputTaxFor("bitcoinjs", network, transactionAmount),
    STHAmount    = parseInt(transactionAmount) + parseInt(taxOutput.value),
    BTCAmount    = unitConverter.toBitcoin(STHAmount),
    //ESTIMATE THE FEE
    estimatedFee = await estimateFee({
      network: 'BTC',
      testnet: network.testnet,
      fromAddress,
      toAddress,
      amount: STHAmount,
      feePerByte: feePerByte
    })
    .catch(e => { throw e; }) //e variable is already an errorPattern
    .then(r => unitConverter.toBitcoin(r));

    // console.log(`Fee_________: ${estimatedFee} (btc)`);
    // console.log(`Total_______: ${BTCAmount} (btc)`);
    // console.log(`__________________________________________`);


    // READ
    // TO AVOID ERRORS, WE DO THE 'getUnsigedTransaction' twice, here and inside the estimateFee
    // READ
    //GET UNSIGNED TRANSACTION FROM AN OBJECT
    let unsignedhex = await getUnsignedTransaction({
      fee:         estimatedFee,
      testnet:     network.testnet,
      transactionAmount: BTCAmount,
      pubKey,
      toAddress,
      fromAddress,
    })
    .catch(e => { //catch have to be in first place
      let { statusText, status, headers } = e.response;
      throw errorPattern(
        `Error on trying to get an unsigned transaction. Explorer status text: ${statusText}`,
        status || 500, 'CREATETRANSACTION_ERROR', headers );
    })
    .then(r => {
      let { error, status, unsignedhex } = r;
      if (error)
        throw errorPattern(`${error}`,status||500,'GETUNSIGNEDTRANSACTION_ERROR');
      if (!unsignedhex)
        throw errorPattern(`Block explorer didnt return any unsignedhex`,500,'GETUNSIGNEDTRANSACTION_ERROR');
      return unsignedhex;
    })
    let tx       = bitcoinjs.Transaction.fromHex(unsignedhex);
    let txb      = bitcoinjs.TransactionBuilder.fromTransaction(tx);
    txb.addOutput(taxOutput.address, taxOutput.value);
    //multi input signing
    for (let i = 0; i < tx.ins.length; i++) {
      txb.sign(i, keyPair);
    }
    let hex      = txb.build().toHex();

    let resultPush = await pushtx(hex).then(e => e.data);
    let { status, pushed } = resultPush;
    if (status.toUpperCase() !== "OK")
      throw errorPattern('Error on trying to create an user transaction',500,'CREATETRANSACTION_ERROR',resultPush);
    return { network: 'USDT', data: { txID: resultPush.tx } }
  } catch (e) {
    //problably it is already an errorPattern object
    if ('message' in e && 'status' in e && 'logMessage' in e)
      return e;
    return errorPattern(e.message || 'Error on creating transaction', e.status || 500, 'CREATETRANSACTION_ERROR', e);
  }
}
const pushtx = async (raw) => {
  let params = new URLSearchParams;
  params.append('signedTransaction',raw);
  return await Axios.post('/v1/transaction/pushtx/',params);
}
const sign = (tx, keyPair) => {
  try {
    _.times(tx.inputs.length, i => tx.sign(i, keyPair))
    return tx
  } catch (error) {
    throw errorPattern(
      error.message || 'Error signing transaction',
      error.status || 500,
      error.messageKey || 'SIGN_TRANSACTION_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}

module.exports = {
  startUserTransaction,
  createTransaction,
}
