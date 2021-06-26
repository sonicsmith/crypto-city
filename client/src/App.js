import { useEffect, useState } from "react"
import {
  createWeb3ReactRoot,
  Web3ReactProvider,
  useWeb3React,
} from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
// import { Contract } from "@ethersproject/contracts"
import { InjectedConnector } from "@web3-react/injected-connector"

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

let provider //, contract

const getLibrary = (_provider) => {
  const library = new Web3Provider(_provider)
  library.pollingInterval = 15000
  provider = library
  api.setProvider(provider)
  // contract = new Contract(MAIN_CONTRACT_ADDRESS, abi, library.getSigner())
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
  cityMap: null,
}

function App() {
  // Web3
  const {
    // chainId,
    account,
    activate,
    active,
  } = useWeb3React()

  // Main State
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [page, setPage] = useState(pages.home)
  const [ethBalance, setEthBalance] = useState()
  const [tokenBalance, setTokenBalance] = useState()

  // City State
  const [cityState, setCityState] = useState(defaultCityState)

  const refreshBalances = () => {
    // Set null to force loading signs
    setEthBalance()
    setTokenBalance()
    api.getEthBalance().then(setEthBalance)
    api.getTokenBalance().then(setTokenBalance)
  }

  const refreshCityMap = () => {
    // Set null to force loading signs
    setCityState({ ...cityState, cityMap: null })
    api.getMap().then((cityMap) => setCityState({ ...cityState, cityMap }))
  }

  // On wallet connect
  useEffect(() => {
    if (active) {
      api.setAccount(account)
      refreshCityMap()
      refreshBalances()
    }
  }, [active, account])

  // If side bar opens, hide city menu
  useEffect(() => {
    setCityState((existingState) => ({ ...existingState, selectedTile: -1 }))
  }, [sideBarOpen])

  return (
    <Box fill>
      <Topbar
        isWeb3Active={active}
        tokenBalance={tokenBalance}
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
          tokenBalance={tokenBalance}
          cityState={cityState}
          setCityState={setCityState}
        />
      )}
      {page === pages.games && <Games />}
      {page === pages.nfts && <Nfts />}
      {page === pages.exchange && (
        <Exchange
          refreshBalances={refreshBalances}
          ethBalance={ethBalance}
          tokenBalance={tokenBalance}
        />
      )}
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
