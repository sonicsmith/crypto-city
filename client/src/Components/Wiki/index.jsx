import { Box, Text, Heading } from "grommet"

export default () => {
  return (
    <Box alignContent="center" fill>
      <Box pad={{ bottom: "large" }} />
      <iframe
        src="https://thesonicsmith.gitbook.io/crypto-city/"
        style={{ height: "100%" }}
      ></iframe>
    </Box>
  )
}
