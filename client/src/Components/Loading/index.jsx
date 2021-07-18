import { Layer, Box, Spinner, Text } from "grommet"

export default ({ loadingMessage }) => {
  return (
    <Layer
      background={{ color: "#00405E", opacity: "medium" }}
      alignContent="center"
    >
      <Box
        alignSelf="center"
        margin="auto"
        background={{
          color: "white",
          opacity: "strong",
        }}
      >
        <Text size="large" margin="medium">
          {loadingMessage}
        </Text>
        <Box alignSelf="center" margin="medium">
          <Spinner size="xlarge" />
        </Box>
      </Box>
    </Layer>
  )
}
