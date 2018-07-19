const axios = require('axios');
const getPrice      = require('./actions/coins/getPrice.js');
const getHistory    = require('./actions/coins/getHistory.js');
const balance       = require('./actions/coins/services/balance.js');
const getTxHistory  = require('./actions/coins/services/history.js');
const walletService = require('./services/wallet/btc/wallet.js');
const Networks      = require('./constants/networks.js');
const transaction   = require('./actions/coins/services/transaction.js');

async function init() {
  // console.log('_______________________ NETWORK HISTORY ___________________________');
  // let a = await getHistory({fromSymbol: 'USDT',toSymbol:'USD',range:'RANGE_1D'});
  // console.log(a);

  console.log('_______________________ BALANCE ___________________________');
  // // normal address
  // // let b = await balance('USDT','14o3XEAL3pc89X9SEMQYgb7X3fK3Zgk8mC',false);
  // // huge address
  // // others
  // // let b = await balance('LNS','37Q5xwWyijgsB9EvVkvRMLuYVv8oJczUmdL',true);
  // // let b = await balance('BTC','mynzMVAjyo7Rn1XP1jpEFyA4EzgYWnmJNz',true);
  // let b = await balance('USDT','1FoWyxwPXuj4C6abqwhjDWdz6D4PZgYRjA',false);
  let b = await balance('USDT','17UrxYAAF5WkjtFKeuZ2S7ojDWoJY2LunF',false);
  console.log(b);

  // console.log('_______________________TXHISTORY___________________________');

  // let th = await getTxHistory({
  //   address: '1FoWyxwPXuj4C6abqwhjDWdz6D4PZgYRjA',
  //   network: 'USDT',
  //   testnet: false
  // });
  // console.log(th.data.history);
  // console.log('_______________________GET PRICE___________________________');

  // let c2 = await getPrice({fromSymbol:'USDT',toSymbol:'USD,EUR,BRL'});
  // console.log(c2);

  // console.log('_______________________TRANSACTION___________________________');
  // let mnemonic = 'relax board logic reason sustain client current during toilet course element impose';
  // // // let keypair  = walletService.mnemonicToKeyPair(mnemonic, Networks.TETHER);
  // // // let keypair  = walletService.mnemonicToKeyPair(mnemonic, Networks.TETHERTESTNET);
  // // // let address  = keypair.getAddress();
  // // // console.log(address);

  // let c = await transaction({mnemonic, network: 'USDT', testnet: true, toAddress: '1FoWyxwPXuj4C6abqwhjDWdz6D4PZgYRjA', amount:'100', feePerByte:'5'});
  // console.log(c);
}
init().catch(e => { console.log(e); });
