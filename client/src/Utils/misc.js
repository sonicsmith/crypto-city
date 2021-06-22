export const getDailyReward = ({ amount, apr }) => {
  const annualAmount = amount * (apr / 100)
  return annualAmount / 365
}

export const formatMoney = (amount) => {
  if (!amount) {
    return
  }

  const [integer, decimals] = amount.toString().split(".")
  const commaInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return commaInt + (decimals ? "." + decimals : "")
}
