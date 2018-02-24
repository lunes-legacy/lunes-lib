const intercepRequest = config => {
  // do something BEFORE the request is sent
  // IE: add a token to the header
  // and then:
  return config
}

const intercepRequestError = error => {
  // do something and then:
  Promise.reject(error)
}

const intercepResponse = response => {
  // do something when response comes and then...
  return response
}

const intercepResponseError = error => {
  // Do something when response comes with an error
  // IE send a message to a Slack channel or Sentry
  // and then...
  Promise.reject(error)
}

module.exports = {
  intercepRequest,
  intercepRequestError,
  intercepResponse,
  intercepResponseError
}
