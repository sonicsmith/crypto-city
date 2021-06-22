const main = {
  GAP: 4,
  TILE_WIDTH: 65,
  TILE_HEIGHT: 33,
  X_OFFSET: 0,
  Y_OFFSET: 250,
  TOUCH_OFFSET_X: 30,
  TOUCH_OFFSET_Y: 150,
  STAKE_TOKEN_NAME: "Binance Coin",
  REWARD_TOKEN_NAME: "Crypto City Token",
  STAKE_TOKEN_SYMBOL: "BNB",
  REWARD_TOKEN_SYMBOL: "CCT",
  REWARD_TOKEN_DECIMALS: 18,
  REWARD_TOKEN_ADDRESS: "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
  MAX_UPGRADE: 6,
  SKY_COLOR: "#80DDFF",
}

// cost is in reward token = 100 = 1 BNB
const cost = {
  tile: {
    1: 200,
    2: 400,
    3: 600,
    4: 800,
    5: 1000,
    6: 1200,
    7: 1400,
  },
}

const text = {
  tileTypeNames: {
    0: "Vacant Lot",
    1: "Section of Land",
    2: "House",
    3: "Block of flats",
    4: "Tower of flats",
    5: "Apartment block",
    6: "Hotel",
  },
}

export default { ...main, text, cost }
