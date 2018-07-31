module.exports = {
  USDT: {
    coinSymbol: 'USDT',
    coinName: 'Tether MainNet',
    testnet: false,
    derivePath: 'm/44\'/1\'/0\'/0',
    maxFee: 1000000,
    defaultFee: 1000,
    insight: 'https://test-insight.bitpay.com/api/',
    bitcoinjsNetwork: {
      messagePrefix: '\x18Tether Signed Message:\n',
      bech32: 'bc',
      bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4
      },
      pubKeyHash: 0x00,
      scriptHash: 0x05,
      wif: 0x80
    }
  },
  USDTTESTNET: {
    coinSymbol: 'USDTTESTNET',
    coinName: 'Tether Testnet',
    testnet: true,
    derivePath: 'm/44\'/1\'/0\'/0',
    maxFee: 1000000,
    defaultFee: 1000,
    insight: 'https://test-insight.bitpay.com/api/',
    bitcoinjsNetwork: {
      messagePrefix: '\x18Tether Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    },
  }
}
