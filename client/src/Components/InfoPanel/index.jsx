import { Card, CardHeader, CardBody, CardFooter, Text, Box } from "grommet"
import * as Icons from "grommet-icons"

export default ({ header, body, footer, onClose }) => {
  const isBodyText = typeof body === "string"
  const isBodyArray = Array.isArray(body)
  const isBodyComponent = !isBodyText && !isBodyArray
  return (
    <Card
      height="small"
      width="medium"
      background="light-3"
      animation={["fadeIn"]}
      round={false}
      elevation="medium"
      style={{ zIndex: 100 }}
    >
      <CardHeader pad={{ top: "small", left: "small", right: "small" }}>
        <Text size={"large"}>{header}</Text>
        <Box onClick={onClose} hoverIndicator>
          <Icons.Close />
        </Box>
      </CardHeader>
      <CardBody pad="small">
        {isBodyText && <Text size={"small"}>{body}</Text>}
        {isBodyArray &&
          body.map((row, index) => (
            <Box pad={{ bottom: "small" }} key={index}>
              <Text size={"small"}>{row}</Text>
            </Box>
          ))}
        {isBodyComponent && body}
      </CardBody>
      <CardFooter
        pad={{ horizontal: "small" }}
        background="light-4"
        pad="small"
      >
        {footer}
      </CardFooter>
    </Card>
  )
}
