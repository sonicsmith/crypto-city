import { Nav, Button, Box } from "grommet"
import * as Icons from "grommet-icons"
import constants from "./../../Utils/constants"

export default ({ onClickHome, onClickGames, onClickNfts }) => {
  return (
    <Box style={{ height: "27%" }}>
      <Nav direction="row" pad="large" alignSelf="center">
        <Button
          icon={
            <Icons.Home color={constants.SKY_COLOR} onClick={onClickHome} />
          }
          primary
          style={{ borderRadius: "100%" }}
        />
        <Button
          icon={
            <Icons.Gamepad color={constants.SKY_COLOR} onClick={onClickGames} />
          }
          primary
          style={{ borderRadius: "100%" }}
        />
        <Button
          icon={
            <Icons.Money color={constants.SKY_COLOR} onClick={onClickNfts} />
          }
          primary
          style={{ borderRadius: "100%" }}
        />
      </Nav>
    </Box>
  )
}
