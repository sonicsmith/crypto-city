import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
import { pause } from "./../Utils/misc"
import constants from "./../Utils/constants"

let library, account, tokenContract, mainContract

const POLLING_DELAY = 2000

const throwBlockChainError = (error) => {
  console.log("Transaction error:", error)
  const message = (error.data && error.data.message) || error.message
  throw new Error(message)
}

const initWeb3 = (web3Connection) => {
  library = web3Connection.library
  tokenContract = web3Connection.tokenContract
  mainContract = web3Connection.mainContract
}

const setAccount = (_account) => {
  account = _account
  //
  // console.log("Setting aproval to zero")
  // const spender = constants.MAIN_CONTRACT_ADDRESS
  // tokenContract.approve(spender, 0).then(console.log)
}

const buyPresale = (ethAmount) => {
  if (!library) {
    throw new Error("Not connected to web3 provider")
  }
  return mainContract.purchasePresale.sendTransaction({
    from: account,
    value: parseEther(ethAmount.toString()),
  })
}

const getMap = () => {
  console.log("getMap")
  return mainContract.getMap(account).then((mapAsString) => {
    console.log(`Got map data "${mapAsString}"`)
    const map = mapAsString || "000000000000" // "111111111111" //
    return map.split("").map((tile) => Number(tile))
  })
}

const setApprovalForStake = async () => {
  console.log("setApprovalForStake()")
  const spender = constants.MAIN_CONTRACT_ADDRESS
  const value = parseUnits(
    String(constants.STAKE_COST),
    constants.REWARD_TOKEN_DECIMALS
  )
  await tokenContract.approve(spender, value)
}

const checkAndUpgradeTile = async ({
  selectedTile,
  currentMap,
  setMessage,
}) => {
  console.log("approveAndUpgradeTile()")
  setMessage("Checking CITY allowance")
  try {
    // First we need to check if there is enough allowance
    const allowance = await getTokenAllowance()
    console.log("Allowance:", allowance)
    // If not enough allowance, then create a approval
    const needsApproval = allowance < constants.STAKE_COST
    if (needsApproval) {
      setMessage("Getting CITY approval (1/2)")
      await setApprovalForStake()
      setMessage("Processing CITY approval (1/2)")
    }

    // Poll till approved
    let hasEnoughAllowance
    while (!hasEnoughAllowance) {
      const allowance = await getTokenAllowance()
      console.log("Allowance:", allowance)
      // If not enough allowance, then keep waiting
      hasEnoughAllowance = allowance >= constants.STAKE_COST
      await pause(POLLING_DELAY)
    }

    setMessage("Getting Upgrade (2/2)")
    const newMap = [...currentMap]
    newMap[selectedTile] = newMap[selectedTile] + 1
    const newMapString = newMap.join("")
    const value = parseUnits(
      String(constants.STAKE_COST),
      constants.REWARD_TOKEN_DECIMALS
    )
    await mainContract.stake(value, newMapString, {
      from: account,
    })
    setMessage("Processing Upgrade (2/2)")
    // Poll till new Map has appeared
    let updatedMap
    while (updatedMap !== newMapString) {
      updatedMap = await mainContract.getMap(account)
      // If changes haven't occured yet, keep waiting
      await pause(POLLING_DELAY)
    }
    setMessage()
    return newMap
  } catch (error) {
    throwBlockChainError(error)
  }
}

const sellTile = async ({ selectedTile, currentMap, amount }) => {
  console.log({ selectedTile, currentMap })
  const newMap = [...currentMap]
  newMap[selectedTile] = 0
  const newMapString = newMap.join("")
  console.log("sellTile(), newMap:", newMapString)
  const value = parseUnits(amount.toString(), constants.REWARD_TOKEN_DECIMALS)
  try {
    await mainContract.withdrawl(value, newMapString, {
      from: account,
    })

    let updatedMap
    while (updatedMap !== newMapString) {
      updatedMap = await mainContract.getMap(account)
      console.log("updatedMap:", updatedMap)
      console.log("newMapString:", newMapString)
      // If changes haven't occured yet, keep waiting
      await pause(POLLING_DELAY)
    }
    return newMap
  } catch (error) {
    throwBlockChainError(error)
  }
}

const getTokenBalance = () => {
  console.log("getTokenBalance")
  return tokenContract.balanceOf(account).then((bigValue) => {
    const amount = formatUnits(bigValue, constants.REWARD_TOKEN_DECIMALS)
    console.log("Got CITY balance:", amount)
    return amount
  })
}

const getStakedBalance = () => {
  console.log("getStakedBalance")
  return mainContract.balanceOf(account).then((bigValue) => {
    const amount = formatUnits(bigValue, constants.REWARD_TOKEN_DECIMALS)
    console.log("Got sCITY balance:", amount)
    return amount
  })
}

const getEthBalance = () => {
  console.log("getEthBalance")
  return library.getBalance(account).then((bigValue) => {
    const amount = formatUnits(bigValue, constants.STAKED_TOKEN_DECIMALS)
    console.log("Got ETH balance:", amount)
    return amount
  })
}

const getTokenAllowance = () => {
  console.log("getTokenAllowance")
  return tokenContract
    .allowance(account, constants.MAIN_CONTRACT_ADDRESS)
    .then((bigValue) => {
      const amount = formatUnits(bigValue, constants.REWARD_TOKEN_DECIMALS)
      console.log("Got CITY allowance:", amount)
      return amount
    })
}

export default {
  initWeb3,
  setAccount,
  getMap,
  checkAndUpgradeTile,
  sellTile,
  getEthBalance,
  getTokenBalance,
  getStakedBalance,
  buyPresale,
  getTokenAllowance,
}
