export const formatMoney = (amount) => {
  if (!amount) {
    return
  }

  const [integer, decimals] = amount.toString().split(".")
  const commaInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return commaInt + (decimals ? "." + decimals : "")
}

export const pause = (milliseconds) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, milliseconds)
  )
}
