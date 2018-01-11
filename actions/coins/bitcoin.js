const createWallet = () => {
  // Create a new wallet, return wallet values
  const wallet = {
    private: '81ee75559d37cbe4b7cbbfb9931ab1ba32172c5cdfc3ac2d020259b4c1104198',
    public:
      '0231ff9ec76820cb36b69061f6ffb125db3793b4aced468a1261b0680e1ef4883a',
    address: 'mvpW7fMSi1nbZhJJDySNS2PUau8ppnu4kY',
    wif: 'cRwGhRjCuuNtPgLcoYd1CuAqjFXCV5YNCQ1LB8RsFCvu61VfSsgR'
  }
  return wallet
}

const getBalance = address => {
  // Read address, request Lunes API and return balance.
  const balanceValue = '2.45782620'
  return balanceValue
}

const getTransactionHistory = address => {
  // Read address, request Lunes API and return transaction history.
  const transaction = require('./transactionModel')
  return transaction
}

const createTransaction = (
  senderPrivateKey,
  receivingAddress,
  transactionAmount
) => {
  // Create a raw tx and broadcast it to the Lunes API. Return txid
  const success = 'true'
  if (success === 'true') {
    const txid =
      'dbf1643b3b51eb8d80e77175a1b745a92df36986d234509dc6e132f62e52d4b1'
    return txid
  } else {
    const error = 'error_msg'
    return error
  }
}

module.exports = {
  createWallet,
  getBalance,
  getTransactionHistory,
  createTransaction
}
