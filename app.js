const LunesLib = require('./index')

const {users, coins } = LunesLib

return coins.getHistory(params)
  .then(res => {
    return res
  }).catch(err => {
    return err
  })
