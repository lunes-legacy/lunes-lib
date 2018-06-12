module.exports = {
  LNS: {
    coinSymbol: 'LNS',
    coinName: 'Lunes',
    testnet: false,
    apiUrl: 'https://lunesnode.lunes.io',
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
    coinSymbol: 'LNS',
    coinName: 'Lunes',
    testnet: true,
    apiUrl: 'https://lunesnode-testnet.lunes.io',
    APICONFIG: {
      minimumSeedLength: 25,
      requestOffset: 0,
      requestLimit: 100,
      logLevel: 'warning',
      timeDiff: 0,
      networkByte: '0'.charCodeAt(0),
      nodeAddress: 'https://lunesnode-testnet.lunes.io/',
      matcherAddress: 'https://lunesnode-testnet.lunes.io/matcher'
    }
  }
}
