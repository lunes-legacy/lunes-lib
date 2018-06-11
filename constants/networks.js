module.exports = {
  BTC: {
    coinSymbol: 'BTC',
    coinName: 'Bitcoin',
    testnet: false,
    derivePath: 'm/49\'/0\'/0\'/0',
    defaultFee: 1000,
    bitcoinjsNetwork: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
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
  BTCTESTNET: {
    coinSymbol: 'BTCTESTNET',
    coinName: 'Bitcoin Testnet',
    testnet: true,
    derivePath: 'm/49\'/1\'/0\'/0',
    defaultFee: 1000,
    bitcoinjsNetwork: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    }
  },
  LTC: {
    coinSymbol: 'LTC',
    coinName: 'Litecoin',
    testnet: false,
    defaultFee: 50000,
    derivePath: 'm/44\'/2\'/0\'/0',
    bitcoinjsNetwork: {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0
    }
  },
  LTCTESTNET: {
    coinSymbol: 'LTCTESTNET',
    coinName: 'Litecoin Testnet',
    testnet: true,
    derivePath: 'm/44\'/1\'/0\'/0',
    defaultFee: 50000,
    bitcoinjsNetwork: {
      messagePrefix: '\x18Litecoin Signed Message:\n',
      bip32: {
        public: 0x0436ef7d,
        private: 0x0436f6e1
      },
      pubKeyHash: 0x6f,
      scriptHash: 0xc4,
      wif: 0xef
    }
  },
  DASH: {
    coinSymbol: 'DASH',
    coinName: 'Dash',
    testnet: false,
    defaultFee: 50000,
    derivePath: 'm/44\'/5\'/0\'/0',
    bitcoinjsNetwork: {
      messagePrefix: '\x19DarkCoin Signed Message:\n',
      bip32: {
        public: 0x02fe52f8,
        private: 0x02fe52cc
      },
      pubKeyHash: 0x4c,
      scriptHash: 0x10,
      wif: 0xcc
    }
  },
  DASHTESTNET: {
    coinSymbol: 'DASHTESTNET',
    coinName: 'Dash Testenet',
    testnet: true,
    defaultFee: 50000,
    derivePath: 'm/44\'/1\'/0\'/0',
    bitcoinjsNetwork: {
      messagePrefix: '\x19DarkCoin Signed Message:\n',
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      },
      pubKeyHash: 0x8c,
      scriptHash: 0x13,
      wif: 0xef
    }
  },
  ETH: {
    coinSymbol: 'ETH',
    coinName: 'Ethereum',
    testnet: false,
    defaultFee: 23000
  },
  ROPSTEN: {
    coinSymbol: 'ETH',
    coinName: 'Ethereum Testnet',
    testnet: true,
    defaultFee: 23000
  },
  LNS: {
    coinSymbol: 'LNS',
    coinName: 'Lunes',
    testnet: false,
    apiUrl: 'https://lunesnode.lunes.io/',
    APICONFIG: {
      minimumSeedLength: 25,
      requestOffset: 0,
      requestLimit: 100,
      logLevel: 'warning',
      timeDiff: 0,
      networkByte: '1'.charCodeAt(0),
      nodeAddress: 'https://lunesnode.lunes.io/',
      matcherAddress: 'https://lunesnode.lunes.io/matcher'
    }
  },
  LNSTESTNET: {
    coinSymbol: 'LNSTESTNET',
    coinName: 'Lunes Testnet',
    testnet: true,
    apiUrl: 'https://testnet.lunes.io/',
    APICONFIG: {
      minimumSeedLength: 25,
      requestOffset: 0,
      requestLimit: 100,
      logLevel: 'warning',
      timeDiff: 0,
      networkByte: '0'.charCodeAt(0),
      nodeAddress: 'https://testnet.lunes.io',
      matcherAddress: 'https://testnet.lunes.io/matcher'
    }
  }
}
