import { Box, Button, Spinner } from "grommet"
import { useEffect, useState } from "react"
import InfoPanel from "../InfoPanel"
import ConfirmationModal from "../ConfirmationModal"
import tileCoords from "./tileCoords"
import images from "./../../Images"
import api from "./../../API"
import { getDailyReward, formatMoney } from "./../../Utils/misc"
import constants from "./../../Utils/constants"
const {
  GAP,
  TILE_WIDTH,
  TILE_HEIGHT,
  X_OFFSET,
  Y_OFFSET,
  TOUCH_OFFSET_X,
  TOUCH_OFFSET_Y,
} = constants

const Tile = ({ x, y, image, isSelected }) => {
  const left = X_OFFSET + x * (TILE_WIDTH + GAP)
  const top = Y_OFFSET + y * (TILE_HEIGHT + GAP)
  const zIndex = y + 10
  const selectedStyle = {}
  if (isSelected) {
    selectedStyle.filter = "contrast(200%)"
  }
  return (
    <img
      style={{
        position: "absolute",
        top,
        left,
        zIndex,
        ...selectedStyle,
      }}
      src={image}
    />
  )
}

const TouchTile = ({ id, x, y, setSelectedTile }) => {
  const left = X_OFFSET + x * (TILE_WIDTH + GAP) + TOUCH_OFFSET_X
  const top = Y_OFFSET + y * (TILE_HEIGHT + GAP) + TOUCH_OFFSET_Y
  return (
    <span
      style={{
        position: "absolute",
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        top,
        left,
        zIndex: 30,
        cursor: "pointer",
      }}
      onClick={() => {
        setSelectedTile(id)
      }}
    ></span>
  )
}

const TileGrid = ({ tileCoords, selectedTile, cityMap }) => {
  return tileCoords.map((coords, index) => {
    const { x, y } = coords
    const isSelected = selectedTile === index
    const image = getTileImageForId(cityMap[index])
    return (
      <Tile
        x={x}
        y={y}
        image={image}
        id={index}
        key={"tile" + index}
        isSelected={isSelected}
      />
    )
  })
}

const TouchOverlay = ({ tileCoords, setSelectedTile, selectedTile }) => {
  return tileCoords.map((coords, index) => {
    const { x, y } = coords
    return (
      <TouchTile
        x={x}
        y={y}
        id={index}
        key={"touchArea" + index}
        setSelectedTile={(id) => {
          if (id === selectedTile) {
            setSelectedTile(-1)
          } else {
            setSelectedTile(id)
          }
        }}
      />
    )
  })
}

const getTileImageForId = (id) => {
  return images.tiles[id]
}

const TileInfoPanel = ({
  tileType,
  selectedTileType,
  setSelectedTile,
  apr,
  setCurrentAction,
  setShowModal,
  credits,
}) => {
  const { tileTypeNames } = constants.text
  const itemName = tileTypeNames[tileType]
  const nextItemName = tileTypeNames[tileType + 1]
  const amount = constants.cost.tile[tileType]
  const nextAmount = constants.cost.tile[tileType + 1]
  const dailyEarnings = getDailyReward({ amount, apr })
  const nextDailyEarnings = getDailyReward({ amount: nextAmount, apr })
  const hasEnoughCredits = credits >= nextAmount
  const upgradeExists = tileType < constants.MAX_UPGRADE

  const body = []

  if (tileType > 0) {
    body.push(
      `Daily Earnings: ${formatMoney(dailyEarnings)} ${
        constants.REWARD_TOKEN_SYMBOL
      }`
    )
  }
  if (upgradeExists) {
    body.push(
      `Buy a ${nextItemName} for ${formatMoney(nextAmount)} ${
        constants.REWARD_TOKEN_SYMBOL
      } to increase your daily earnings to ${formatMoney(nextDailyEarnings)} ${
        constants.REWARD_TOKEN_SYMBOL
      } a day.`
    )
    if (!hasEnoughCredits) {
      body.push(`You need more ${constants.REWARD_TOKEN_NAME} to buy this.`)
    }
  } else {
    body.push("This land has been upgraded to the maximum value!")
  }

  return (
    <Box style={{ position: "absolute", top: 60, left: 10 }}>
      <InfoPanel
        onClose={() => setSelectedTile(-1)}
        header={itemName}
        body={body}
        footer={
          <>
            {upgradeExists && (
              <Button
                label={selectedTileType > 0 ? "UPGRADE" : "BUY"}
                primary
                hoverIndicator
                onClick={() => {
                  setCurrentAction(actions.buy)
                  setShowModal(true)
                }}
                disabled={!hasEnoughCredits}
              />
            )}
            {selectedTileType > 0 && (
              <Button
                label={"SELL"}
                primary
                hoverIndicator
                onClick={() => {
                  setCurrentAction(actions.sell)
                  setShowModal(true)
                }}
              />
            )}
          </>
        }
      />
    </Box>
  )
}

const actions = {
  buy: "buy",
  sell: "sell",
}

export default ({ credits, cityState, setCityState }) => {
  //
  const [selectedTile, setSelectedTile] = [
    cityState.selectedTile,
    (selectedTile) => setCityState({ ...cityState, selectedTile }),
  ]
  const [showModal, setShowModal] = [
    cityState.showModal,
    (showModal) => setCityState({ ...cityState, showModal }),
  ]

  //
  const [currentAction, setCurrentAction] = useState()
  const [actionQuestion, setActionQuestion] = useState()

  const showInfoPanel = selectedTile >= 0 && !showModal
  const cityMap = cityState.cityMap || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const selectedTileType = selectedTile >= 0 && cityMap[selectedTile]

  useEffect(() => {
    if (selectedTileType >= 0) {
      const { tileTypeNames } = constants.text
      if (currentAction === actions.buy) {
        const nextItemName = tileTypeNames[selectedTileType + 1]
        const nextAmount = formatMoney(
          constants.cost.tile[selectedTileType + 1]
        )
        setActionQuestion(
          `Buy ${nextItemName} for ${nextAmount} ${constants.REWARD_TOKEN_SYMBOL}?`
        )
      } else {
        const currentItemName = tileTypeNames[selectedTileType]
        const currentAmount = formatMoney(constants.cost.tile[selectedTileType])
        setActionQuestion(
          `Sell ${currentItemName} for ${currentAmount} ${constants.REWARD_TOKEN_SYMBOL}?`
        )
      }
    }
  }, [currentAction, selectedTileType])

  const { apr } = cityState

  return (
    <Box alignContent="center" fill>
      {showInfoPanel && (
        <TileInfoPanel
          apr={apr}
          tileType={selectedTileType}
          selectedTileType={selectedTileType}
          setSelectedTile={setSelectedTile}
          setCurrentAction={setCurrentAction}
          setShowModal={setShowModal}
          credits={credits}
        />
      )}
      <Box alignSelf="center" style={{ position: "relative" }}>
        <TouchOverlay
          tileCoords={tileCoords}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
        />
        {cityMap && (
          <TileGrid
            tileCoords={tileCoords}
            selectedTile={selectedTile}
            cityMap={cityMap}
          />
        )}
        {!cityMap && <Spinner />}
        {showModal && (
          <ConfirmationModal
            header={"Confirm"}
            body={actionQuestion}
            setShowModal={setShowModal}
            onConfirm={async () => {
              if (currentAction === actions.buy) {
                api.upgradeTile(selectedTile)
              } else {
                api.sellTile(selectedTile)
              }
              setSelectedTile(-1)
            }}
          />
        )}
      </Box>
    </Box>
  )
}
