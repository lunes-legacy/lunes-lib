
module.exports = async (bonusRate, coinAmount, exchangeRate, unitPrice, coupon) => {
  if (coupon && coupon !== '') {
    bonusRate += 0.01
  }

  let exchangeUnitPrice = unitPrice / exchangeRate
  let buyAmount = coinAmount / exchangeUnitPrice
  let bonusAmount = buyAmount * bonusRate
  let totalAmount = buyAmount + bonusAmount

  return {
    buyAmount: buyAmount,
    bonusAmount: bonusAmount,
    totalAmount: totalAmount
  }
}