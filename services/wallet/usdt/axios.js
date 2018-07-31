const {
  OMNIEXPLORER_API
} = require('./constants.js');
const axios = require('axios');

const Axios = axios.create({
  baseURL: `${OMNIEXPLORER_API}`,
  headers: {
    'Content-Type':'application/x-www-form-urlencoded'
  }
});

module.exports = Axios;
