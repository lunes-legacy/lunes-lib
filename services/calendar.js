const moment = require('moment')

module.exports = {
  diff: (date1, date2, unity) => moment(date1, 'DD/MM/YY').diff(moment(date2, 'DD/MM/YY'), unity),
  getTimestamp: date => moment(date, 'DD/MM/YY').format('x'),
  getCompleteDate: (date, mask) => moment.unix(date).utc().format(mask || 'DD/MM/YY'),
  isBefore: (date1, date2) => moment(date1, 'DD/MM/YY').isBefore(moment(date2, 'DD/MM/YY'))
}
