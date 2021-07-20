const main = {
  GAP: 4,
  TILE_WIDTH: 65,
  TILE_HEIGHT: 33,
  X_OFFSET: 0,
  Y_OFFSET: 250,
  TOUCH_OFFSET_X: 30,
  TOUCH_OFFSET_Y: 150,
  CHAIN_ID: 56,
  NETWORK_NAME: "Binance Smart Chain",
  STAKE_TOKEN_NAME: "Binance Coin",
  REWARD_TOKEN_NAME: "Crypto City Token",
  STAKE_TOKEN_SYMBOL: "BNB",
  REWARD_TOKEN_SYMBOL: "CITY",
  REWARD_TOKEN_DECIMALS: 18,
  TOKEN_CONTRACT_ADDRESS: "0x7dBeF2188E8BAD28ee76B0781062a00aA32f1804",
  MAIN_CONTRACT_ADDRESS: "0xBF6bE696A6e17d924F3Aa8721c93814C2bb3B25A",
  SKY_COLOR: "#80DDFF",
}

// cost is in reward token = 100 = 1 BNB
const STAKE_COST = 10
// MAX for one plot is STAKE_COST * 6 (60)

const TEXT = {
  TILE_TYPE_NAMES: {
    0: "Vacant Lot",
    1: "Plot of Land",
    2: "House",
    3: "Block of flats",
    4: "Tower of flats",
    5: "Apartment block",
    6: "Hotel",
  },
}

const MAX_UPGRADE = Object.keys(TEXT.TILE_TYPE_NAMES).length - 1

const CHAIN_ID = 97
// {
//   TEST: 97,
//   MAIN: 56,
// }

export default {
  ...main,
  TEXT,
  MAX_UPGRADE,
  CHAIN_ID,
  STAKE_COST,
}
