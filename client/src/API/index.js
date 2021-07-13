import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
import { pause } from "./../Utils/misc"
import constants from "./../Utils/constants"

let library, account, tokenContract, mainContract

const getBlockChainError = (error) => {
  console.error("ERROR:", error)
  const message = (error.data && error.data.message) || error.message
  return { error: message }
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
  try {
    const spender = constants.MAIN_CONTRACT_ADDRESS
    const value = parseUnits(
      String(constants.STAKE_COST),
      constants.REWARD_TOKEN_DECIMALS
    )
    await tokenContract.approve(spender, value)
    return { result: value }
  } catch (error) {
    return getBlockChainError(error)
  }
}

// const upgradeTile = async ({
//   selectedTile,
//   currentMap,
//   setMessage,
// }) => {
//   console.log("upgradeTile(), check allowance")
//   if (safetyCutoff > 100) {
//     return
//   }
//   safetyCutoff++
//   setMessage("Checking CITY allowance")
//   try {
//     // First we need to check if there is enough allowance
//     const allowance = await getTokenAllowance()
//     console.log("Allowance:", allowance)
//     // If not enough allowance, then create a approval
//     const needsApproval = allowance < constants.STAKE_COST
//     if (needsApproval) {
//       // if we haven't applied for approval
//       if (!hasInitiatedApproval) {
//         setMessage("Getting CITY approval")
//         await setApprovalForStake()
//         setMessage("Processing CITY approval")
//         // Poll, waiting for allowance
//         return setTimeout(() => {
//           // start recursive call
//           return upgradeTile({
//             selectedTile,
//             currentMap,
//             setMessage,
//             hasInitiatedApproval: true,
//           })
//         }, 2000)
//       } else {
//         // Poll, waiting for allowance
//         return new Promise(res
//         return setTimeout(() => {
//           // start recursive call
//           return upgradeTile({
//             selectedTile,
//             currentMap,
//             setMessage,
//             hasInitiatedApproval: true,
//           })
//         }, 2000)
//       }
//     } else {
//       setMessage("Processing Upgrade")
//       const newMap = [...currentMap]
//       newMap[selectedTile] = newMap[selectedTile] + 1
//       const newMapString = newMap.join("")
//       const value = parseUnits(
//         String(constants.STAKE_COST),
//         constants.REWARD_TOKEN_DECIMALS
//       )
//       await mainContract.stake(value, newMapString, {
//         from: account,
//       })
//       return { result: newMap }
//     }
//   } catch (error) {
//     return getBlockChainError(error)
//   }
// }

const checkAndUpgradeTile = async ({
  selectedTile,
  currentMap,
  setMessage,
}) => {
  console.log("approveAndUpgradeTile()")
  setMessage("Checking CITY allowance")
  setMessage()
  return { result: "111111111111" }
  try {
    // First we need to check if there is enough allowance
    const allowance = await getTokenAllowance()
    console.log("Allowance:", allowance)
    // If not enough allowance, then create a approval
    const needsApproval = allowance < constants.STAKE_COST
    if (needsApproval) {
      setMessage("Getting CITY approval")
      await setApprovalForStake()
      setMessage("Processing CITY approval")
    }
    // Poll till approved
    let hasEnoughAllowance
    while (!hasEnoughAllowance) {
      const allowance = await getTokenAllowance()
      console.log("Allowance:", allowance)
      // If not enough allowance, then keep waiting
      hasEnoughAllowance = allowance >= constants.STAKE_COST
      await pause(3000)
    }

    setMessage("Processing Upgrade")
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
    return { result: newMap }
  } catch (error) {
    return getBlockChainError(error)
  }
}

const sellTile = ({ selectedTile, currentMap }) => {
  const newMap = [...currentMap]
  newMap[selectedTile] = newMap[selectedTile] - 1
  const newMapString = newMap.join("")
  console.log("sellTile(), newMap:", newMapString)
  const value = parseUnits(
    String(constants.STAKE_COST),
    constants.REWARD_TOKEN_DECIMALS
  )
  return mainContract
    .withdrawl(value, newMap, {
      from: account,
    })
    .then(() => newMap)
}

const getTokenBalance = () => {
  console.log("getTokenBalance")
  return tokenContract.balanceOf(account).then((amount) => {
    console.log("Got CITY balance for", account, amount)
    return formatUnits(amount, constants.REWARD_TOKEN_DECIMALS)
  })
}

const getEthBalance = () => {
  console.log("getEthBalance")
  return library.getBalance(account).then((amount) => {
    console.log("Got ETH balance for", account, amount)
    return formatUnits(amount, constants.REWARD_TOKEN_DECIMALS)
  })
}

const getTokenAllowance = () => {
  console.log("getTokenAllowance")
  return tokenContract
    .allowance(account, constants.MAIN_CONTRACT_ADDRESS)
    .then((amount) => {
      console.log("Got CITY allowance for", account, amount)
      return formatUnits(amount, constants.REWARD_TOKEN_DECIMALS)
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
  buyPresale,
  getTokenAllowance,
  setApprovalForStake,
}
