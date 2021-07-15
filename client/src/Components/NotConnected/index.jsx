import { Box, Text, Heading } from "grommet"

export default () => {
  return (
    <Box alignContent="center" fill>
      <Box margin="auto">
        <Heading textAlign="center">Not Connected</Heading>
        <Text textAlign="center">Please Connect to view your city</Text>
      </Box>
    </Box>
  )
}
