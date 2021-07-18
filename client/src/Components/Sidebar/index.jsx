import { useContext } from "react"
import { Box, Button, ResponsiveContext, Sidebar, Nav } from "grommet"
import * as Icons from "grommet-icons"

const pages = {
  home: "home",
  games: "games",
  nfts: "nfts",
  exchange: "exchange",
  wiki: "wiki",
}

const SidebarNav = ({ label, page, setPage, setSideBarOpen }) => {
  return (
    <Button
      primary
      label={label}
      onClick={() => {
        setPage(pages[page])
        setSideBarOpen(false)
      }}
      hoverIndicator
    />
  )
}

export default ({ setPage, setSideBarOpen }) => {
  const size = useContext(ResponsiveContext)
  return (
    <Box
      animation={{
        type: "slideRight",
        duration: 300,
        size: "xlarge",
      }}
      width="small"
      style={{
        zIndex: 200,
        position: "absolute",
        height: "100%",
      }}
      elevation="small"
    >
      <Sidebar
        background="brand"
        header={<Box pad={size === "small" ? "large" : "small"}></Box>}
        footer={<Button icon={<Icons.Github />} hoverIndicator />}
      >
        <Nav gap="small">
          <SidebarNav
            label="HOME"
            page={pages.home}
            setPage={setPage}
            setSideBarOpen={setSideBarOpen}
          />
          <SidebarNav
            label={`EXCHANGE`}
            page={pages.exchange}
            setPage={setPage}
            setSideBarOpen={setSideBarOpen}
          />
          <SidebarNav
            label="NFTs"
            page={pages.nfts}
            setPage={setPage}
            setSideBarOpen={setSideBarOpen}
          />
          <SidebarNav
            label="GAMES"
            page={pages.games}
            setPage={setPage}
            setSideBarOpen={setSideBarOpen}
          />
          <SidebarNav
            label="WHITE PAPER"
            page={pages.wiki}
            setPage={setPage}
            setSideBarOpen={setSideBarOpen}
          />
        </Nav>
      </Sidebar>
    </Box>
  )
}
