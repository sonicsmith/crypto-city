import { formatUnits } from "@ethersproject/units"
import constants from "./../Utils/constants"

const dummyMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

let provider, account

const setAccount = (_account) => {
  account = _account
}

const setProvider = (_provider) => {
  provider = _provider
}

const getMap = () => {
  return new Promise((res) => {
    res(dummyMap)
  })
}

const upgradeTile = (selectedTile) => {
  return new Promise((res) => {
    dummyMap[selectedTile]++
    res({ success: true })
  })
}

const sellTile = (selectedTile) => {
  return new Promise((res) => {
    dummyMap[selectedTile]--
    res({ success: true })
  })
}

const getAPR = () => {
  return new Promise((res) => {
    res(100)
  })
}

const getCreditBalance = () => {
  if (!provider) {
    return new Promise((res) => res(0))
  }
  return provider.getBalance(account).then((amount) => {
    return formatUnits(amount, constants.REWARD_TOKEN_DECIMALS)
  })
}

export default {
  getMap,
  upgradeTile,
  sellTile,
  getAPR,
  getCreditBalance,
  setProvider,
  setAccount,
}
