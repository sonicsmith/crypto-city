const CryptoCityToken = artifacts.require("./CryptoCityToken.sol")
const CryptoCityMain = artifacts.require("./CryptoCityMain.sol")

module.exports = function (deployer) {
  deployer.deploy(CryptoCityToken)
  deployer.deploy(CryptoCityMain)
}
