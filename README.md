# Lunes Lib

The Official and agnostic library to wrap Lunes API.

## V 0.0.30

* Coins: Get coins prices, history

### Prerequisites

* [NodeJS](http://nodejs.org) - 8.x LTS

### Instalation

Using NPM

```sh
$ npm i --save lunes-lib
```

Using Yarn

```sh
$ yarn add lunes-lib
```

### Importing

```javascript
//CommonJS's require
const LunesCore = require("lunes-lib");
const { users, coins } = LunesCore;

//Webpack/es6
import { users, coins } from "lunes-lib";
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

#### .users.update(id, {fullname,small,birthDate,city,state,country,homeAddress}, accessToken)

Update user's profile.

Returns the updated user profile.

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

### ICO

#### .ico.buyBalance({email,sale_phase_id})

Get the buy balance in cryptocurrency and lunes for the user

#### .coins.getHistory({fromDate, toDate, fromSymbol,toSymbom, exchange})

Obtain an history of some currency (fromSymbol) and its conversion to another (toSymbol) in a period from "fromDate" to "toDate".

If the period is smaller than 1 day, the history is by hour. Otherwise, it will by daily.

fromSymbol => e.g. one of BTC, USD, BRL
toSymbol => e.g. one of BTC, USD, BRL
range => e.g. one of [RANGE_1D, RANGE_1W, RANGE_1M, RANGE_3M, RANGE_6M, RANGE_1Y, RANGE_MAX]

Return an object containing history metadata and an array containing the low, high values and date.

```javascript
{
  "success": true,
  "status": 200,
  "message": "Historical chart - BTC to USD",
  "range": "RANGE_1D",
  "data": [
    {
      "close": 12787.35,
      "time": 1516903200
    },
    {
      "close": 11913.74,
      "time": 1516906800
    },
    {
      "close": 11388.52,
      "time": "1516914000
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

##### .coins.bitcoin.estimate({senderAddress, receivingAddress, amount, feePerByte}, accessToken)

Calculates and returns the estimate fee for the given parameters.

## Tests (not tottaly covered)

```sh
$ npm test
```

## Pull requests

Always at branch "develop".

## License

MIT.
