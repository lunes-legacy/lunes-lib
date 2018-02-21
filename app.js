/** ********************************************************
 *                                                        *
 *             APP'S ROUTING DEPENDENCIES                 *
 *                                                        *
 **********************************************************/
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const expressStatusMonitor = require('express-status-monitor')
const ensureEnvironmentService = require('./services/ensureEnvironmentService')
const databaseService = require('./services/database/database.js')

/** ********************************************************
 *                                                        *
 *            APP ENVIROMENT VARIABLES LOADER             *
 *                                                        *
 **********************************************************/

// aqui será carregado as varivaies de ambiente de acordo com o comando
// export NODE_ENV=dev - desenvovlmento
// export NODE_ENV=production - producao
// export NODE_ENV=qa - qa

dotenv.load({
  path: `.env.${process.env.NODE_ENV}`
})
ensureEnvironmentService()

/** ********************************************************
 *                                                        *
 *                FIREBASE CONFIGURATION                  *
 *                                                        *
 **********************************************************/

const { firebase, configs } = require('./config/firebase')
!firebase.apps.length ? firebase.initializeApp(configs) : firebase.app()

/** ********************************************************
 *                                                        *
 *               APP ROUTING DEPENDENCIES                 *
 *                                                        *
 **********************************************************/
const userRouter = require('./routing/usersRouting.js')
const coinRouter = require('./routing/coinsRouting.js')
const depositRouter = require('./routing/depositRouting.js')
const icoRouter = require('./routing/icoRouting.js')

/** ********************************************************
 *                                                        *
 *                 EXPRESS CONFIGURATION                  *
 *                                                        *
 **********************************************************/

// Create Express server.
const app = express()

/** ********************************************************
 *                                                        *
 *             SOCKET IO CONFIGURARTION                   *
 *                                                        *
 **********************************************************/
try {
  // const socketIOConfig = require('./config/socket.io.config.js');
  // socketIOConfig.init();
} catch (error) {
  console.log(error)
}

// Express configuration.
app.use(helmet())
app.set('port', process.env.PORT || 3000)
app.use(expressStatusMonitor())
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '40mb', extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())

app.use(passport.initialize())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.use(require('./config/origin').allowOrigin)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization ,Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('XS_SHARING_ALLOWED_CREDENTIALS', true)
  res.header('XS_SHARING_ALLOWED_METHODS', 'GET,POST,PUT,HEAD,DELETE,OPTIONS')
  res.header(
    'XS_SHARING_ALLOWED_HEADERS',
    'Authorization,Content-Type,X-Requested-With,Cache-Control'
  )
  next()
})

global.dbPool = databaseService.poolFactory()

/** ********************************************************
 *                                                        *
 *         APP KEYS AND PASSPORT CONFIGURATION            *
 *                                                        *
 **********************************************************/

// Isso aqui precisamos ver com calma na questão de validar as request antes de reposnder com os dados
const validateBearer = require('./config/validateBearer')
passport.use(new BearerStrategy(validateBearer))

const passportConfig = () => {}

/** ******************************************
 *                                          *
 *       APP'S ROUTERS INITIALIZATION       *
 *                                          *
 ********************************************/

userRouter.startRouting(app, passportConfig)
coinRouter.startRouting(app, passportConfig)
depositRouter.startRouting(app, passportConfig)
icoRouter.startRouting(app, passportConfig)

// Start Express server
app.listen(app.get('port'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    '',
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

module.exports = app
