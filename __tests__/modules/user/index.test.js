require('dotenv').config()
jest.setTimeout(15000)

const ChanceLib = require('chance')
const {users} = require('../../../index.js')

const chance = new ChanceLib()

let createdUser, persistedUser, email, password, fullname, timezone

beforeAll(() => {
  email = chance.email() // randomly generated
  password = chance.string({length: 8}) // randomly generated
  fullname = chance.string({length: 25}) // randomly generated,
  timezone = 'America/Sao_Paulo'
})

afterAll(() => {
  persistedUser.remove()
  return createdUser.delete()
})

test('Should create a new users', () => {
  expect.assertions(2)
  return users.create({ email, password, fullname, timezone }).then(user => {
    expect(user.accessToken).toBeTruthy()
    expect(user.refreshToken).toBeTruthy()
  })
})

test('Should not create a user with an invalid email', () => {
  expect(() => users.create({ email: chance.string({length: 15}), password, fullname, timezone }))
    .rejects.toThrow('The email is invalid.')
})

test('Should not create a user without the required fields', () => {
  expect(() => users.create({ email, password, fullname }))
    .rejects.toThrow('The fields email, fullname, password and timezone are required.')
})
