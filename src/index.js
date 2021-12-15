import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

import { ContractKitProvider, Alfajores } from '@celo-tools/use-contractkit';

import '@celo-tools/use-contractkit/lib/styles.css';

ReactDOM.render(
    <ContractKitProvider 
        dapp={{
            name: "Safe Forsage Smart Matrix",
            description: "Safe Smart Matrix Platform - With Reward Token",
            url: "https://safeforsage.io"
        }}
        networks={[Alfajores]}
        network={{
          name: 'Alfajores',
          rpcUrl: 'https://alfajores-forno.celo-testnet.org',
          graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
          explorer: 'https://alfajores-blockscout.celo-testnet.org',
          chainId: 44787,
        }}
        >
        <Router>
            <App />
        </Router>
    </ContractKitProvider>,
    document.getElementById("root")
);
