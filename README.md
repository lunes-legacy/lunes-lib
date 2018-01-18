# Lunes Core

Official and agnostic library to wrap Lunes API.

## V 0.0.31
- Confirm Phone number fix
- Logout operation

### Prerequisites
- [NodeJS](http://nodejs.org) - 8.x LTS
- Firebase credentials (see below)

### Instalation
Using NPM
```sh
$ npm i --save lunes-core
```
Using Yarn
```sh
$ yarn add lunes-core
```
### Importing

```javascript
//CommonJS's require
const LunesCore = require('lunes-core')
const {users, coins} = LunesCore

//Webpack/es6
import {users, coins} from 'lunes-core'
```

## API

### Users

#### .users.create({email,password,fullname,timezone})
Creates a new user into Firebase authentication and into realtime database. This user **must** to contain a valid email, password, full name and timezone (Default is America/Sao_Paulo).

Returns an access token for current user.

For timezone formats, see [the list of timezones and its time offsets.](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List "the list of timezones and its time offsets.")

#### .users.login({email,password})

User login into Lunes API, using email and password credentials. 

Returns an access token for current user.

#### .users.resetPassword({email)

Request a password recovery e-mail.

Returns a confirmation object.

#### .users.obtain(id,acessToken)

Get the personal info from current logged user.

Returns user's personal info object.

#### .users.createPin({pin},acessToken)

Create a new PIN to current logged user.

Returns a confirmation and pinIsVerified = true.

#### .users.confirmPin({pin},acessToken)

Confirm the PIN code before some operation that it is asked.

Returns a confirmation.

#### .users.confirmPhone({phoneNumber},acessToken)

Confirm the phone number.

Returns a confirmation and phoneIsVerified = true.

### Coins

#### Bitcoin

##### .coins.bitcoin.createWallet()

Creates new BTC wallet. Returns the created wallet (private, public, address and wif).

##### .coins.bitcoin.getBalance(address)
Read address, request Lunes API and return balance.

##### .coins.bitcoin.getTransactionHistory(address)
Read address, request Lunes API and return transaction history.

##### .coins.bitcoin.createTransaction(senderPrivateKey, receivingAddress, transactionAmount)
Create a raw tx and broadcast it to the Lunes API. Return txid.

## Tests

```sh
$ npm test
```

## License

This is a private project by Lunes Team.
