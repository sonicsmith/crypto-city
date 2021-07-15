import { useEffect, useState } from "react"
import {
  createWeb3ReactRoot,
  Web3ReactProvider,
  useWeb3React,
} from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { Contract } from "@ethersproject/contracts"
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
import constants from "./Utils/constants"
import cryptoCityMain from "./contracts/CryptoCityMain.json"
import cryptoCityToken from "./contracts/CryptoCityToken.json"
import ErrorModal from "./Components/ErrorModal"
import Loading from "./Components/Loading"
import NotConnected from "./Components/NotConnected"

export const injected = new InjectedConnector({
  supportedChainIds: [constants.CHAIN_ID],
})

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK")

const getLibrary = (provider) => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  const mainContract = new Contract(
    constants.MAIN_CONTRACT_ADDRESS,
    cryptoCityMain.abi,
    library.getSigner()
  )
  const tokenContract = new Contract(
    constants.TOKEN_CONTRACT_ADDRESS,
    cryptoCityToken.abi,
    library.getSigner()
  )
  api.initWeb3({ library, mainContract, tokenContract })
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
  const { chainId, account, activate, active } = useWeb3React()

  // Main State
  const [sideBarOpen, setSideBarOpen] = useState(false)
  const [page, setPage] = useState(pages.home)
  const [ethBalance, setEthBalance] = useState()
  const [tokenBalance, setTokenBalance] = useState()
  const [error, setError] = useState()
  const [loadingMessage, setLoadingMessage] = useState()

  // City State
  const [cityState, setCityState] = useState(defaultCityState)

  const refreshAccount = async () => {
    setLoadingMessage("Loading Account")
    setEthBalance()
    setTokenBalance()
    const ethBal = await api.getEthBalance()
    setEthBalance(ethBal)
    const tokenBal = await api.getTokenBalance()
    setTokenBalance(tokenBal)
    const cityMap = await api.getMap()
    setCityState({ ...cityState, cityMap })
    setLoadingMessage()
  }

  // On wallet connect
  useEffect(() => {
    console.log("Wallet state change", { active, account, chainId })
    if (active) {
      if (chainId !== constants.CHAIN_ID) {
        alert("Please set network to " + constants.NETWORK_NAME)
      } else {
        api.setAccount(account)
        refreshAccount()
      }
    }
  }, [active, account, chainId])

  // If side bar opens, hide city menu
  useEffect(() => {
    if (sideBarOpen) {
      setCityState((existingState) => ({ ...existingState, selectedTile: -1 }))
    }
  }, [sideBarOpen])

  // If error, hide loading, hide city menu
  useEffect(() => {
    if (error) {
      setLoadingMessage()
      setCityState((existingState) => ({ ...existingState, selectedTile: -1 }))
    }
  }, [error])

  return (
    <Box fill>
      {loadingMessage && <Loading loadingMessage={loadingMessage} />}
      <Topbar
        isWeb3Active={active}
        tokenBalance={tokenBalance}
        onClickBalance={() => {
          console.log("onClickBalance", active)
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

      {error && (
        <ErrorModal header={"Error"} body={error} setShowModal={setError} />
      )}

      {page === pages.home && !active && <NotConnected />}
      {page === pages.home && active && (
        <City
          tokenBalance={tokenBalance}
          cityState={cityState}
          setCityState={setCityState}
          setError={setError}
          setLoadingMessage={setLoadingMessage}
        />
      )}
      {page === pages.games && <Games />}
      {page === pages.nfts && <Nfts />}
      {page === pages.exchange && (
        <Exchange
          refreshBalances={refreshAccount}
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
