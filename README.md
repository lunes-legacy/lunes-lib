# Lunes Lib

Official and agnostic library to wrap Lunes API.

## V 0.0.3
- Coins: Get coins prices, history

### Prerequisites
- [NodeJS](http://nodejs.org) - 8.x LTS

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

#### .users.create({email,password,fullname})
Creates a new user into Firebase authentication and into realtime database. This user **must** to contain a valid email, password and fullname.

Returns an access token for current user.

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

#### .coins.getPrice({fromSymbol,toSymbom,exchange})

Obtain the realtime price of one or more currencies.

fromSymbol => e.g. one of BTC, USD, BRL
toSymbol => a comma separated list e.g. BTC,ETC,USD,EUR,BRL
exchange => Exchange's name, default is CCCAGG

Returns an object containg the asked currency prices.

e.g 

```javascript
{"BTC":0.009878,"USD":10.79,"EUR":10.37}
```

#### .coins.getHistory({fromDate, toDate, fromSymbol,toSymbom, exchange})

Obtain an history of some currency (fromSymbol) and its conversion to another (toSymbol) in a period from "fromDate" to "toDate".

If the period is smaller than 1 day, the history is by hour. Otherwise, it will by daily.

fromSymbol => e.g. one of BTC, USD, BRL
toSymbol => e.g. one of BTC, USD, BRL
fromDate => Date formatted as DD/MM/YY, e.g. 25/10/2017
toDate => Date formatted as DD/MM/YY, e.g. 25/01/2018
exchange => Exchange's name, default is CCCAGG

Return an object containing history metadata and an array containing the low, high values and date.

```javascript
{
  "success": true,
  "status": 200,
  "message": "Historical chart - BTC to USD",
  "period": "21/01/18 to 23/01/18",
  "data": [
    {
      "high": 12787.35,
      "low": 11101.73,
      "day": "21/01/18"
    },
    {
      "high": 11913.74,
      "low": 10067.76,
      "day": "22/01/18"
    },
    {
      "high": 11388.52,
      "low": 9980.5,
      "day": "23/01/18"
    }
  ]
}
```
 

#### Bitcoin

The following functions are specific when the currency is Bitcoin (BTC).

##### .coins.bitcoin.getBalance({address}, accessToken)
Read address, request Lunes API and returns balance.

##### .coins.bitcoin.getHistory({address}, accessToken)
Read address, request Lunes API and returns transaction history.

##### .coins.bitcoin.backupWallet({email}, accessToken)
Returns the user's wallet seed.

## Tests (not tottaly covered)

```sh
$ npm test
```

## License

MIT.
