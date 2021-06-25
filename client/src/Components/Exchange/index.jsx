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
  Distribution,
  Grid,
} from "grommet"
import * as Icons from "grommet-icons"
import { useState } from "react"
import images from "./../../Images"
import constants from "./../../Utils/constants"

export default ({}) => {
  const [ETHAmount, setETHAmount] = useState(0)
  const ethBalance = 0.101
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
                  >{`Balance: ${ethBalance}`}</Text>
                </Box>
              </Box>
              <Box direction="row" margin={{ bottom: "small" }}>
                <Box margin={{ right: "small" }} width="100%">
                  <TextInput
                    gridArea="header"
                    width="small"
                    type="number"
                    placeholder="0.0"
                    value={ETHAmount}
                    onChange={(event) => setETHAmount(event.target.value)}
                  />
                </Box>
                <Box margin={{ right: "small" }}>
                  <Image
                    gridArea="nav"
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
          </CardBody>
          <CardFooter
            pad={{ horizontal: "small" }}
            background="light-4"
            pad="small"
          >
            <Button
              fill={true}
              label={"SWAP"}
              primary
              hoverIndicator
              onClick={() => {
                //
              }}
              // disabled={!hasEnoughCredits}
            />
          </CardFooter>
        </Card>
      </Box>
    </Box>
  )
}
