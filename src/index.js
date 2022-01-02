import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// Importing thirdweb
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

// We will support the Rinkeby chain (4)
const supportedChainIds = [4];

// We are supporting Metamask (injected wallet)
const connectors = {
  injected: {},
};

// Render the App component to the DOM
// Wrap with ThirdwebWeb3Provider
ReactDOM.render(
  <React.StrictMode>
  <ThirdwebWeb3Provider 
  connectors = {connectors}
  supportedChainIds = {supportedChainIds}
  >
    <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
