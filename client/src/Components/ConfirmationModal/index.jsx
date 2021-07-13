import { Button } from "grommet"
import Modal from "../Modal"

export default ({ header, body, onConfirm, setShowModal }) => {
  return (
    <Modal
      header={header}
      body={body}
      setShowModal={setShowModal}
      footer={
        <>
          <Button
            label={"YES"}
            primary
            hoverIndicator
            onClick={() => {
              onConfirm()
              // setShowModal(false)
            }}
          />
          <Button
            label={"NO"}
            primary
            hoverIndicator
            onClick={() => setShowModal(false)}
          />
        </>
      }
      onClose={() => setShowModal(false)}
    />
  )
}
