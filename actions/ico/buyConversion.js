/**
 * .
 * @param {*} bonusRate - bonus percentage
 * @param {*} inputAmount - coin input amount
 * @param {*} exchangeRate - coin exchange rate
 * @param {*} unitPrice - price of each LNS in USD
 * @param {*} coupon - coupon code
 */
const toLNS = (bonusRate, inputAmount, exchangeRate, unitPrice, coupon) => {
  if (coupon && coupon !== '') {
    bonusRate += 0.01
  }

  bonusRate = Number(bonusRate)
  inputAmount = Number(inputAmount)
  exchangeRate = Number(exchangeRate)
  unitPrice = Number(unitPrice)

  let exchangeUnitPrice = unitPrice / exchangeRate
  let buyAmount = inputAmount / exchangeUnitPrice
  let bonusAmount = buyAmount * bonusRate
  let totalAmount = buyAmount + bonusAmount

  buyAmount = buyAmount.toFixed(8)
  bonusAmount = bonusAmount.toFixed(8)
  totalAmount = totalAmount.toFixed(8)

  return {
    buyAmount: buyAmount,
    bonusAmount: bonusAmount,
    totalAmount: totalAmount
  }
}

/**
 * .
 * @param {*} bonusRate - bonus percentage
 * @param {*} inputAmount - LNS input amount
 * @param {*} exchangeRate - coin exchange rate
 * @param {*} unitPrice - price of each LNS in USD
 * @param {*} coupon - coupon code
 */
const fromLNS = (bonusRate, inputAmount, exchangeRate, unitPrice, coupon) => {
  if (coupon && coupon !== '') {
    bonusRate += 0.01
  }

  bonusRate = Number(bonusRate)
  inputAmount = Number(inputAmount)
  exchangeRate = Number(exchangeRate)
  unitPrice = Number(unitPrice)

  let exchangeUnitPrice = unitPrice / exchangeRate
  let buyAmount = inputAmount * exchangeUnitPrice
  let bonusAmount = buyAmount * bonusRate
  let totalAmount = buyAmount + bonusAmount

  buyAmount = buyAmount.toFixed(8)
  bonusAmount = bonusAmount.toFixed(8)
  totalAmount = totalAmount.toFixed(8)

  return {
    buyAmount: buyAmount,
    bonusAmount: bonusAmount,
    totalAmount: totalAmount
  }
}

module.exports = {
  toLNS,
  fromLNS
}
