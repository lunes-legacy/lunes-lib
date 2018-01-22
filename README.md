# Lunes Core

Official and agnostic library to wrap Lunes API.

## V 0.0.34
- Coins: Balance, history and backup wallet.
- Users: Create wallet on signup.

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

#### Bitcoin

##### .coins.bitcoin.getBalance({address}, accessToken)
Read address, request Lunes API and returns balance.

##### .coins.bitcoin.getHistory({address}, accessToken)
Read address, request Lunes API and returns transaction history.

##### .coins.bitcoin.backupWallet({email}, accessToken)
Returns the user's wallet seed.

## Tests

```sh
$ npm test
```

## License

This is a private project by Lunes Team.
