import { Layer, Box } from "grommet"
import InfoPanel from "../InfoPanel"

export default ({ setShowModal, header, body, footer }) => {
  return (
    <Layer
      onEsc={() => setShowModal(false)}
      onClickOutside={() => setShowModal(false)}
      background={{ color: "#00405E", opacity: "medium" }}
      alignContent="center"
    >
      <Box alignSelf="center" margin="auto">
        <InfoPanel
          header={header}
          body={body}
          footer={footer}
          onClose={() => setShowModal(false)}
        />
      </Box>
    </Layer>
  )
}
