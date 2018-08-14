module.exports = {
  ETH: {
    coinSymbol: 'ETH',
    coinName: 'Ethereum',
    testnet: false,
    derivePath: 'm/44\'/0\'/0\'/0',
    gasPrice: 10000000000,
    gasLimit: 23000,
    chainID: 1,
    apiUrl: 'https://api.myetherwallet.com/eth'
  },
  ROPSTEN: {
    coinSymbol: 'ETH',
    coinName: 'Ethereum Testnet',
    testnet: true,
    derivePath: 'm/44\'/0\'/0\'/0',
    gasPrice: 10000000000,
    gasLimit: 23000,
    chainID: 3,
    apiUrl: 'https://api.myetherwallet.com/rop'
  }
}
