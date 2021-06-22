import { useEffect, useState } from "react"
import {
  createWeb3ReactRoot,
  Web3ReactProvider,
  useWeb3React,
} from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { Contract } from "@ethersproject/contracts"
import { InjectedConnector } from "@web3-react/injected-connector"

// const FLASH_CONTRACT_ADDRESS = "0xBE41FD0066386acF3CBd02262E3cD17e760C4AEe"

import { Box } from "grommet"
import Topbar from "./Components/Topbar"
import Sidebar from "./Components/Sidebar"
import City from "./Components/City"
import api from "./API"
import Games from "./Components/Games"
import Nfts from "./Components/Nfts"
import Exchange from "./Components/Exchange"
import Wiki from "./Components/Wiki"

export const injected = new InjectedConnector({
  supportedChainIds: [56],
})

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK")

let provider, contract

const getLibrary = (_provider) => {
  const library = new Web3Provider(_provider)
  library.pollingInterval = 15000
  provider = library
  api.setProvider(provider)
  // contract = new Contract(FLASH_CONTRACT_ADDRESS, abi, library.getSigner())
  return library
}

const pages = {
  home: "home",
  games: "games",
  nfts: "nfts",
  exchange: "exchange",
  wiki: "wiki",
}

const defaultCityState = {
  selectedTile: -1,
  showModal: false,
  apr: 0,
  cityMap: null,
}

function App() {
  // Web3
  const { chainId, account, activate, active } = useWeb3React()

  // Main State
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [page, setPage] = useState(pages.home)
  const [credits, setCredits] = useState(0)

  // City State
  const [cityState, setCityState] = useState(defaultCityState)

  useEffect(() => {
    const getData = async () => {
      const cityMap = await api.getMap()
      const apr = await api.getAPR()
      setCityState({ ...cityState, apr, cityMap })
    }
    if (active) {
      api.setAccount(account)
      api.getCreditBalance().then(setCredits)
      getData()
    }
  }, [active])

  useEffect(() => {
    setCityState({ ...cityState, selectedTile: -1 })
  }, [sideBarOpen])

  return (
    <Box fill>
      <Topbar
        isWeb3Active={active}
        credits={credits}
        onClickBalance={() => {
          if (!active) {
            activate(injected)
          } else {
            setPage(pages.exchange)
          }
        }}
        sideBarOpen={sideBarOpen}
        setSideBarOpen={setSideBarOpen}
      />
      {sideBarOpen && (
        <Sidebar
          sideBarOpen={sideBarOpen}
          setSideBarOpen={setSideBarOpen}
          pages={pages}
          setPage={setPage}
        />
      )}
      {page === pages.home && (
        <City
          credits={credits}
          cityState={cityState}
          setCityState={setCityState}
        />
      )}
      {page === pages.games && <Games />}
      {page === pages.nfts && <Nfts />}
      {page === pages.exchange && <Exchange />}
      {page === pages.wiki && <Wiki />}
    </Box>
  )
}

export default () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <App />
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
}
