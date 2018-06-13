# Lunes Lib

The Official and agnostic library to wrap Lunes API.

## V 0.0.36

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
const LunesLib = require("lunes-lib");
const { users, coins, ico, networks, services } = LunesLib;

//Webpack/es6
import { users, coins, ico, networks, services } from "lunes-lib";
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

---

#### Validate Token

`.users.validateToken.(token)`

Validate user's access token.

##### Parameters:

* `token` String

##### Return: Object (documented in source-code)

### Coins

#### Balance

`.coins.services.balance({params})`

Obtain balance for an address.

##### Parameters:

* `network` String
* `address` String
* `testnet` Boolean (optional)

##### Return: Object (documented in source-code)

#### History

`.coins.services.history({params})`

Obtain transaction history for an address.

##### Parameters:

* `network` String
* `address` String
* `testnet` Boolean (optional)

##### Return: Object (documented in source-code)

#### Network Fees

`.coins.services.networkFees({params})`

Obtain the current network high, medium and low fees.

##### Parameters:

* `network` String
* `testnet` Boolean (optional)

##### Return: Object (documented in source-code)

#### Estimate Fee

`.coins.services.estimateFee({params}, accessToken)`

Estimate transaction fee for given parameters.
Must provide user accessToken for authentication.

##### Parameters - Bitcoin Family:

* `network` String
* `testnet` Boolean (optional)
* `toAddress` String
* `fromAddress` String
* `amount` String - satoshi unit
* `feePerByte` String - satoshi unit

##### Parameters - Ethereum:

* `network` String
* `testnet` Boolean (optional)
* `toAddress` String
* `fromAddress` String
* `amount` String - wei unit
* `gasLimit` String
* `gasPrice` String - wei unit

##### Return: Object (documented in source-code)

#### Transaction

`.coins.services.transaction({params}, accessToken)`

Create transaction for given parameters.
Must provide user accessToken for authentication.

##### Parameters - Bitcoin Family:

* `network` String
* `testnet` Boolean (optional)
* `toAddress` String
* `amount` String - satoshi unit
* `feePerByte` String - satoshi unit

##### Parameters - Ethereum:

* `network` String
* `testnet` Boolean (optional)
* `toAddress` String
* `amount` String - wei unit
* `gasLimit` String
* `gasPrice` String - wei unit

##### Parameters - Lunes:

* `mnemonic` String
* `network` String
* `testnet` Boolean (optional)
* `toAddress` String
* `amount` String - in smallest unit
* `fee` String - in smallest unit

##### Return: Object (documented in source-code)

#### Lease

`.coins.services.lease({params})`

Create a lease transaction for given parameters.

##### Parameters:

* `mnemonic` String
* `testnet` Boolean (optional)
* `toAddress` String
* `amount` String - in smallest unit
* `fee` String - in smallest unit

##### Return: Object (documented in source-code)

#### Lease Cancel

`.coins.services.leaseCancel({params})`

Cancel a lease transaction for given parameters.

##### Parameters:

* `mnemonic` String
* `testnet` Boolean (optional)
* `txID` String
* `fee` String - in smallest unit

##### Return: Object (documented in source-code)
---
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
      "time": 1516914000
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

## Pull requests

Always at branch "develop".

## License

MIT.
