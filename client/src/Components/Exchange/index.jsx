import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Box,
  TextInput,
  Image,
} from "grommet"
import { useState } from "react"
import images from "./../../Images"
import constants from "./../../Utils/constants"
import api from "./../../API"

export default ({ refreshBalances, ethBalance, tokenBalance }) => {
  const [spendAmount, setETHAmount] = useState(ethBalance || 0)
  return (
    <Box alignContent="center" fill>
      <Box margin="auto">
        <Card
          height="medium"
          width="medium"
          background="light-3"
          animation={["fadeIn"]}
          round={false}
          elevation="medium"
          style={{ zIndex: 100 }}
        >
          <CardHeader
            pad={{
              top: "small",
              left: "small",
              right: "small",
              bottom: "medium",
            }}
            direction="column"
            alignContent="start"
          >
            <Box alignSelf="start">
              <Text size={"large"}>Presale available now</Text>
              <Text size={"small"}>
                Swap {constants.STAKE_TOKEN_SYMBOL} for CITY in an instant
              </Text>
            </Box>
          </CardHeader>
          <CardBody pad="small">
            <Box
              width="100%"
              height="130"
              pad="small"
              background="light-4"
              round="small"
            >
              <Box direction="row" margin={{ bottom: "small" }}>
                <Box>
                  <Text size={"small"}>{"From"}</Text>
                </Box>
                <Box alignContent="end" width="100%">
                  <Text
                    size={"small"}
                    width="100%"
                    textAlign="end"
                  >{`Balance: ${ethBalance || "-"}`}</Text>
                </Box>
              </Box>
              <Box direction="row" margin={{ bottom: "small" }}>
                <Box margin={{ right: "small" }} width="100%">
                  <TextInput
                    width="small"
                    type="number"
                    placeholder="0.0"
                    value={spendAmount}
                    onChange={(event) => setETHAmount(event.target.value)}
                  />
                </Box>
                <Box margin={{ right: "small" }}>
                  <Image
                    width="30"
                    height="30"
                    src={images.bscLogo}
                    margin="auto"
                  />
                </Box>
                <Box>
                  <Text size="small" margin="auto">
                    {constants.STAKE_TOKEN_SYMBOL}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box
              margin={{ top: "medium" }}
              width="100%"
              height="130"
              pad="small"
              background="light-4"
              round="small"
            >
              <Box direction="row" margin={{ bottom: "small" }}>
                <Box>
                  <Text size={"small"}>{"To"}</Text>
                </Box>
                <Box alignContent="end" width="100%">
                  <Text
                    size={"small"}
                    width="100%"
                    textAlign="end"
                  >{`Balance: ${tokenBalance || "-"}`}</Text>
                </Box>
              </Box>
              <Box direction="row" margin={{ bottom: "small" }}>
                <Box margin={{ right: "small" }} width="100%">
                  <TextInput
                    width="small"
                    type="number"
                    placeholder="0.0"
                    value={spendAmount * 100}
                    onChange={(event) => setETHAmount(event.target.value / 100)}
                  />
                </Box>
                <Box margin={{ right: "small" }}>
                  <Image
                    width="30"
                    height="30"
                    src={images.cityLogo}
                    margin="auto"
                  />
                </Box>
                <Box>
                  <Text size="small" margin="auto">
                    {constants.REWARD_TOKEN_SYMBOL}
                  </Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
          <CardFooter background="light-4" pad="small">
            <Button
              fill={true}
              label={"SWAP"}
              primary
              hoverIndicator
              onClick={async () => {
                // set Loading
                await api.buyPresale(spendAmount)
                refreshBalances()
              }}
              disabled={spendAmount > ethBalance}
            />
          </CardFooter>
        </Card>
      </Box>
    </Box>
  )
}
