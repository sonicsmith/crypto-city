// const CryptoCityToken = artifacts.require("CryptoCityToken")

// contract("CryptoCityToken", async (accounts) => {
//   it("should put the correct amount of CryptoCityToken in the first account", async () => {
//     const instance = await CryptoCityToken.deployed()
//     const balance = await instance.balanceOf.call(accounts[0])
//     const initialSupply = 10 * Math.pow(10, 12)
//     assert.equal(balance.valueOf(), initialSupply, "Incorrect Intial Supply")
//   })

//   it("should send coin correctly", async () => {
//     // Get initial balances of first and second account.
//     const owner = accounts[0]
//     const account_one = accounts[1]
//     const account_two = accounts[2]

//     let account_one_starting_balance
//     let account_two_starting_balance
//     let account_one_ending_balance
//     let account_two_ending_balance

//     const amount = 1

//     const instance = await CryptoCityToken.deployed()
//     await instance.transfer(account_one, amount, { from: owner })

//     const balance = await instance.balanceOf.call(account_one)

//     account_one_starting_balance = balance.toNumber()
//     const balance2 = await instance.balanceOf.call(account_two)

//     account_two_starting_balance = balance2.toNumber()
//     await instance.transfer(account_two, amount, { from: account_one })

//     const balance3 = await instance.balanceOf.call(account_one)
//     account_one_ending_balance = balance3.toNumber()
//     const balance4 = await instance.balanceOf.call(account_two)

//     account_two_ending_balance = balance4.toNumber()

//     assert.equal(
//       account_one_ending_balance,
//       account_one_starting_balance - amount,
//       "Amount wasn't correctly taken from the sender"
//     )
//     assert.equal(
//       account_two_ending_balance,
//       account_two_starting_balance + amount,
//       "Amount wasn't correctly sent to the receiver"
//     )
//   })
// })
