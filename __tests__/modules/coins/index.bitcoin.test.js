require('dotenv').config()

const {coins} = require('../../../index.js')

let wallet, receiver

beforeAll(() => {
  wallet = coins.bitcoin.createWallet()

  receiver = coins.bitcoin.createWallet()
})

afterAll(() => {
  wallet = null
})

test('Should create a wallet', () => {
  expect.assertions(4)
  expect(wallet).toHaveProperty('private')
  expect(wallet).toHaveProperty('public')
  expect(wallet).toHaveProperty('address')
  expect(wallet).toHaveProperty('wif')
})

test('Should return balance', () => {
  const balance = coins.bitcoin.getBalance(wallet.address)
  expect.assertions(2)
  expect(typeof balance).toBe('string')
  expect(Number(balance)).toBeTruthy()
})

test('Should create a transaction', () => {
  const transaction = coins.bitcoin.createTransaction(wallet.private, receiver.address, 1000)
  expect(typeof transaction).toBe('string')
  expect(Number(transaction)).toBeFalsy()
})
