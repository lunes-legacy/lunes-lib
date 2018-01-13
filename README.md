# Lunes Core

Official and agnostic library to wrap Lunes API.

**Table of Contents**

## V 0.0.17
- Create user and login
- Mock coins and its operations

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
### Configurations
1.  Ensure you have firebase credentials and insert it into a .env file as follows. This is file **is not versioned**.

```
API_ENDPOINT=[SOME API ADDRESS]
LUNES_SERVER_ENDPOINT=[LUNES SERVER API ADDRESS]

FIREBASE_API_KEY=[FB API KEY]
FIREBASE_AUTH_DOMAIN=[FB AUTH DOMAIN]
FIREBASE_DATABASE_URL=[FB DATABASE]
FIREBASE_PROJECT_ID=[FB PROJECT]
FIREBASE_STORAGE_BUCKET=[FBSTORAGE BUCKET]
FIREBASE_MESSAGING_SENDER_ID=[FB SENDER ID]
```

2. Call the Lunes Core module

```javascript
//CommonJS's require
const LunesCore = require('lunes-core')

//Webpack/es6
import LunesCore from 'lunes-core'
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
