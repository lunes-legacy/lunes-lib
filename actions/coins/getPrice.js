const axios = require('axios')
const validator = require('../../services/validators/validator')

const endpoint = `${require('../../constants/Cryptocompare')}/price`

module.exports = async params => {
  const { fromSymbol, toSymbol, exchange } = params

  const query = [
    fromSymbol && !validator.isEmpty(fromSymbol) ? `fsym=${fromSymbol}` : '',
    toSymbol && !validator.isEmpty(toSymbol) ? `tsyms=${toSymbol}` : '',
    exchange && !validator.isEmpty(exchange) ? `e=${exchange}` : ''
  ]

  const queryString = query.reduce(
    (q1, q2) => (query.length > 0 ? q1 + '&' + q2 : q1)
  )

  try {
    const res = await axios.get(`${endpoint}?${queryString.length > 0 ? queryString : ''}`)

    if (fromSymbol.search(/(lns)|(lunes)/i) !== -1) {
      let coinValues = await axios.get(`${endpoint}?fsym=USD&tsyms=BRL,EUR`)
      coinValues = coinValues.data

      const exratesUrl = 'https://exrates.me/public/coinmarketcap/ticker'
      const newCashUrl = 'https://broker.newc.com.br/api/ticket/market/LUNES'

      // Get LUNES price from Exrates
      const exrates = await axios.get(exratesUrl)

      // Return exrates values if find lunes in response
      if (Object.keys(exrates).includes('LNS_BTC')) {
        const LUNESData = exrates.data.LNS_BTC

        // Get USD BTC price
        let BTCValue = await axios.get(`${endpoint}?fsym=BTC&tsyms=USD,BRL,EUR`)
        BTCValue = BTCValue.data

        const lnsUsdValue = BTCValue.USD * LUNESData.last
        const lnsEurValue = lnsUsdValue * coinValues.EUR
        const lnsBrlValue = lnsUsdValue * coinValues.BRL

        return { 'BRL': lnsBrlValue, 'EUR': lnsEurValue, 'USD': lnsUsdValue }
      }

      // If not find in exrates fetch values from NewCash
      const newCash = await axios.get(newCashUrl)
      const newCashData = newCash.data.market

      const lunesBrl = parseFloat(newCashData.sellPrice)
      const lunesUsd = lunesBrl / coinValues.BRL // Convert from BRL to USD
      const lunesEur = lunesUsd * coinValues.EUR // Convert from BRL to EUR

      return { 'BRL': lunesBrl, 'EUR': lunesUsd, 'USD': lunesEur }
    }

    return res.data
  } catch (err) {
    return err.response ? err.response.data : new Error(err)
  }
}
