import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { Grommet } from "grommet"

const theme = {
  global: {
    font: {
      family: "Cabin",
      size: "14px",
      height: "20px",
    },
    colors: {
      brand: "#0081bd",
      sky: "#a1ecff",
      // sky: "linear-gradient(0deg, rgba(184,243,255,1) 0%, rgba(0,198,255,1) 48%, rgba(0,82,99,1) 100%)",
    },
    icon: {
      size: {
        large: 10,
      },
    },
  },
}

ReactDOM.render(
  <Grommet theme={theme} full background="sky">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Grommet>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
