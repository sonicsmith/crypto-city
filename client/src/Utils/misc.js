export const formatMoney = (amount) => {
  if (!amount) {
    return
  }

  const [integer, decimals] = amount.toString().split(".")
  const commaInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  const decimalPlaces = 4
  return commaInt + (decimals ? "." + decimals.substr(0, decimalPlaces) : "")
}

export const pause = (milliseconds) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, milliseconds)
  )
}
