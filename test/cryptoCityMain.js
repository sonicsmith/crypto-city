const CryptoCityToken = artifacts.require("./CryptoCityToken.sol")
const CryptoCityMain = artifacts.require("./CryptoCityMain.sol")
const { toBN } = web3.utils
const totalAmountTokens = toBN(10).mul(toBN(10).pow(toBN(30)))
const oneEth = toBN("1000000000000000000")
const oneEthWorthOftokens = oneEth.mul(toBN("100"))

contract("CryptoCityMain", (accounts) => {
  let tokenInstance
  let mainInstance
  let owner, user1, user2, user3

  before(async () => {
    console.log("Preparing Tests")
    // Setup accounts
    owner = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]
    user3 = accounts[3]
    user4 = accounts[4]
    // Setup contracts
    tokenInstance = await CryptoCityToken.deployed()
    mainInstance = await CryptoCityMain.deployed()
    // Set token address
    await mainInstance.setTokenAddress(tokenInstance.address)
    // Spread ETH to 3 accounts
    for (let i = 1; i < 5; i++) {
      web3.eth.sendTransaction({
        from: owner,
        to: accounts[i],
        value: oneEth,
      })
    }
    // Set presale
    await tokenInstance.approve(mainInstance.address, totalAmountTokens)
    await mainInstance.setPresale(totalAmountTokens)
  })

  it("should not allow a stake without tokens", async () => {
    // Initial Stake
    await tokenInstance.approve(mainInstance.address, 1, {
      from: user1,
    })
    try {
      await mainInstance.stake(1, "theMap", { from: user1 })
      assert(false, "Stake without tokens should throw Error")
    } catch {
      assert(true, "Made it")
    }
  })

  it("should handle presale", async () => {
    // Give four people equal amounts of tokens
    for (let i = 1; i < 5; i++) {
      await mainInstance.purchasePresale.sendTransaction({
        from: accounts[i],
        value: oneEth,
      })
      const balance = await tokenInstance.balanceOf.call(accounts[i])
      assert.equal(
        balance.toString(),
        oneEthWorthOftokens.toString(),
        "The presale balance was not correct"
      )
    }
  })

  it("should not allow a stake without approval", async () => {
    // Initial Stake
    try {
      await tokenInstance.approve(mainInstance.address, 0, {
        from: user1,
      })
      await mainInstance.stake(1, "theMap", { from: user1 })
      assert.ok(false)
    } catch (e) {
      assert.equal(
        e.reason,
        "Allowance not met",
        "Should throw allowance error"
      )
    }
    // Check staked amount
    const stakedAmount = await mainInstance.getStakedAmount.call(user1)
    assert.equal(
      stakedAmount.toString(),
      "0",
      "Tokens should not stake without approval"
    )
  })

  it("should handle an initial stake", async () => {
    // Initial Stake
    await tokenInstance.approve(mainInstance.address, oneEthWorthOftokens, {
      from: user1,
    })
    await mainInstance.stake(oneEthWorthOftokens, "theMap", {
      from: user1,
    })
    // Get results
    const map = await mainInstance.getMap.call(user1)
    assert.equal(map, "theMap", "The map was not correct")
    const stakedAmount = await mainInstance.getStakedAmount.call(user1)
    assert.equal(
      stakedAmount.toString(),
      "100000000000000000000",
      "The staked amount was not correct"
    )
    const tokenAmount = await tokenInstance.balanceOf.call(user1)
    assert.equal(tokenAmount.toString(), "0", "The tokens were not taken")
  })

  it("should handle a second stake", async () => {
    // User 2 stake
    await tokenInstance.approve(mainInstance.address, oneEthWorthOftokens, {
      from: user2,
    })
    await mainInstance.stake(oneEthWorthOftokens, "theMap2", {
      from: user2,
    })
    // Get results
    const stakedAmount1 = await mainInstance.getStakedAmount.call(user1)
    const stakedAmount2 = await mainInstance.getStakedAmount.call(user2)
    assert.equal(
      stakedAmount1.toString(),
      "101010101010101010101",
      "The first amount was not correct"
    )
    assert.equal(
      stakedAmount2.toString(),
      "98989898989898989898",
      "The second amount was not correct"
    )
  })

  it("should handle a third stake", async () => {
    // User 3 stake
    await tokenInstance.approve(mainInstance.address, oneEthWorthOftokens, {
      from: user3,
    })
    await mainInstance.stake(oneEthWorthOftokens, "theMap2", {
      from: user3,
    })
    // Get results
    const stakedAmount1 = await mainInstance.getStakedAmount.call(user1)
    const stakedAmount2 = await mainInstance.getStakedAmount.call(user2)
    const stakedAmount3 = await mainInstance.getStakedAmount.call(user3)
    assert.equal(
      stakedAmount1.toString(),
      "101688021151108399430",
      "The first amount was not correct"
    )
    assert.equal(
      stakedAmount2.toString(),
      "99654260728086231441",
      "The second amount was not correct"
    )
    assert.equal(
      stakedAmount3.toString(),
      "98657718120805369127",
      "The third amount was not correct"
    )
  })

  it("should not allow a withdrawl of too many tokens", async () => {
    // Initial Stake
    try {
      await mainInstance.withdrawl(oneEthWorthOftokens, "theMap2", {
        from: user2,
      })
      assert.ok(false)
    } catch (e) {
      assert.equal(
        e.reason,
        "Amount is more than balance",
        "Should throw correct error"
      )
    }
  })

  it("should handle a withdrawl", async () => {
    // User 2 withdrawl
    await mainInstance.withdrawl("99654260728086231441", "theMap2", {
      from: user2,
    })
    // Get results
    const stakedAmount1 = await mainInstance.getStakedAmount.call(user1)
    const stakedAmount2 = await mainInstance.getStakedAmount.call(user2)
    const stakedAmount3 = await mainInstance.getStakedAmount.call(user3)
    assert.equal(
      stakedAmount1.toString(),
      "102699636832035069122",
      "The first amount was not correct"
    )
    assert.equal(
      stakedAmount2.toString(),
      "0",
      "The second amount was not correct"
    )
    assert.equal(
      stakedAmount3.toString(),
      "99639187654440424063",
      "The third amount was not correct"
    )
    const tokenAmount = await tokenInstance.balanceOf.call(user2)
    assert.equal(
      tokenAmount.toString(),
      "99654260728086231441",
      "The tokens were not returned"
    )
  })

  it("should handle a stake back after withdrawl", async () => {
    // User 2 stake
    const amount = "1000000000"
    await tokenInstance.approve(mainInstance.address, amount, {
      from: user2,
    })
    await mainInstance.stake(amount, "theMap2", {
      from: user2,
    })
    // Get results
    const stakedAmount1 = await mainInstance.getStakedAmount.call(user1)
    const stakedAmount2 = await mainInstance.getStakedAmount.call(user2)
    const stakedAmount3 = await mainInstance.getStakedAmount.call(user3)
    assert.equal(
      stakedAmount1.toString(),
      "102699636832045220376",
      "The first amount was not correct"
    )
    assert.equal(
      stakedAmount2.toString(),
      "980000000",
      "The second amount was not correct"
    )
    assert.equal(
      stakedAmount3.toString(),
      "99639187654450272809",
      "The third amount was not correct"
    )
  })
  /*
  it("should continue staking and correctly allocate taxes", async () => {
    const numLoops = 8
    const numUsers = 4
    const amount = oneEthWorthOftokens.div(toBN(numLoops))
    for (let i = 0; i < numLoops; i++) {
      const startBalance = [null, null, null, null, null]
      // CHECK USER START AMOUNT
      for (let ii = 1; ii <= numUsers; ii++) {
        const stakedAmount = await mainInstance.getStakedAmount.call(
          accounts[ii]
        )
        startBalance[ii] = stakedAmount
      }
      // DO A STAKE
      await tokenInstance.approve(mainInstance.address, amount, {
        from: user4,
      })
      await mainInstance.stake(amount, "theMap2", {
        from: user4,
      })

      // Check taxed amount
      const user4Amount = await mainInstance.getStakedAmount.call(user4)
      const taxedAmount = amount - (user4Amount - startBalance[4])
      // CHECK EXISTING USERS AMOUNTS
      for (let ii = 1; ii < numUsers; ii++) {
        const stakedAmount = await mainInstance.getStakedAmount.call(
          accounts[ii]
        )
        const difference = stakedAmount - startBalance[ii] 
      }
    }
  })
  */
})
