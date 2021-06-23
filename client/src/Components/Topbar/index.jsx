import { Box, Header, Text, Button } from "grommet"
import * as Icons from "grommet-icons"
import constants from "./../../Utils/constants"
import { formatMoney } from "./../../Utils/misc"
const { REWARD_TOKEN_SYMBOL } = constants

export default ({
  credits,
  sideBarOpen,
  setSideBarOpen,
  onClickBalance,
  isWeb3Active,
}) => {
  const balance = formatMoney(credits)
  return (
    <Box
      elevation="medium"
      background="brand"
      style={{
        zIndex: 300,
        width: "100%",
        position: "absolute",
      }}
    >
      <Header>
        <Button
          icon={<Icons.Menu />}
          onClick={() => {
            setSideBarOpen(!sideBarOpen)
          }}
          hoverIndicator
        />
        <Box
          round="xsmall"
          onClick={onClickBalance}
          hoverIndicator
          style={{
            width: "80%",
            position: "fixed",
            left: "50%",
            marginLeft: "-40%",
          }}
        >
          {isWeb3Active ? (
            <Text textAlign="center">
              Balance: {balance} {REWARD_TOKEN_SYMBOL}
            </Text>
          ) : (
            <Text textAlign="center">Connect</Text>
          )}
        </Box>
      </Header>
    </Box>
  )
}
