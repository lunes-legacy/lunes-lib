module.exports = {
  TETHER: {
    coinSymbol: 'TETHER',
    coinName: 'Tether MainNet',
    testnet: false,
    derivePath: 'm/44\'/1\'/0\'/0',
    maxFee: 1000000,
    defaultFee: 1000,
    insight: 'https://test-insight.bitpay.com/api/'
  },
  TETHERTESTNET: {
    coinSymbol: 'TETHERTESTNET',
    coinName: 'Tether Testnet',
    testnet: true,
    derivePath: 'm/44\'/1\'/0\'/0',
    maxFee: 1000000,
    defaultFee: 1000,
    insight: 'https://test-insight.bitpay.com/api/'
  }
}
