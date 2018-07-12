const axios = require('axios');
const validator = require('../../services/validators/validator');

const endpoint = `${require('../../constants/Cryptocompare')}/price`;

module.exports = async params => {
  const { fromSymbol, toSymbol, exchange } = params;

  const query = [
    fromSymbol && !validator.isEmpty(fromSymbol) ? `fsym=${fromSymbol}` : '',
    toSymbol && !validator.isEmpty(toSymbol) ? `tsyms=${toSymbol}` : '',
    exchange && !validator.isEmpty(exchange) ? `e=${exchange}` : ''
  ]

  const queryString = query.reduce(
    (q1, q2) => (query.length > 0 ? q1 + '&' + q2 : q1)
  )

  try {
    const res = await axios.get(`${endpoint}${queryString.length > 0 ? `?${queryString}` : ''}`);

    if (fromSymbol.search(/(lns)|(lunes)/i) !== -1) {
      let coinValues = await axios.get(`${endpoint}?fsym=USD&tsyms=BRL,EUR`);
      coinValues = coinValues.data;
      
      //Get LUNES price in BTC
      let LUNESData  = await axios.get(`https://exrates.me/public/coinmarketcap/ticker`);
      LUNESData      = LUNESData.data.LNS_BTC;
      
      //Get USD BTC price 
      let BTCValue  = await axios.get(`${endpoint}?fsym=BTC&tsyms=USD,BRL,EUR`);
      BTCValue = BTCValue.data;
      let lnsUsdValue = BTCValue.USD * LUNESData.last;
      let lnsEurValue = lnsUsdValue * coinValues.EUR;
      let lnsBrlValue = lnsUsdValue * coinValues.BRL;
      let objectLunes = { "BRL": lnsBrlValue, "EUR": lnsEurValue, "USD": lnsUsdValue };

      return objectLunes;
    }
    return res.data;

  } catch (err) {
    return err.response ? err.response.data : new Error(err);
  }
}
