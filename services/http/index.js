require('dotenv').config()

const axios = require('axios')
const http = axios.create({
  baseURL: process.env.LUNES_SERVER_ENDPOINT
})
const { intercepRequest,
  intercepRequestError,
  intercepResponse,
  intercepResponseError } = require('./interceptors')

http.interceptors.request.use(intercepRequest, intercepRequestError)
http.interceptors.response.use(intercepResponse, intercepResponseError)

module.exports = http
