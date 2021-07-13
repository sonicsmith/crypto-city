import { Button } from "grommet"
import Modal from "../Modal"

export default ({ body, setShowModal }) => {
  return (
    <Modal
      header={"Error"}
      body={body}
      setShowModal={setShowModal}
      footer={
        <Button
          label={"OK"}
          primary
          hoverIndicator
          onClick={() => {
            setShowModal()
          }}
        />
      }
      onClose={() => setShowModal()}
    />
  )
}
