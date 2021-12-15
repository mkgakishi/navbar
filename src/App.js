import { useState, useEffect } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { useContractKit } from '@celo-tools/use-contractkit';

import { ToastContainer } from "react-toastify";

import dotenv from "dotenv";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Reward from "./pages/Reward";
import Office from "./pages/Office";
import Governance from "./pages/Governance";
import Register from "./pages/Register";

import Layout from "./components/Layout";

import { abi } from "./helpers/contract";


import 'react-toastify/dist/ReactToastify.css';

dotenv.config();

///const kit = newKit(process.env.REACT_APP_NODE_URL);

function App({ ...rest }) {

    const { address, connect, destroy, kit } = useContractKit()

    const [pick, setPick] = useState('')

    const contract = new kit.web3.eth.Contract(
        abi,
        process.env.REACT_APP_MATRIX_ADDRESS)

    useEffect(() => {
        if (window.localStorage.getItem("pick")) {
            setPick(window.localStorage.getItem("pick"))
        }
    }, [])

    const props = { connect, setPick, contract, kit, address, pick, destroy }

    return (
        <Layout {...props} >
            <Switch>
                <Route path="/" exact>
                    {pick ? <Office {...props} /> : <Home />}
                </Route>
                <Route path="/login">
                    {pick ? <Redirect to="/" /> : <Login {...props} />}
                </Route>
                <Route path="/reward">
                    <Reward />
                </Route>
                <Route path="/office/:ref">
                    <Office />
                </Route>
                <Route path="/governance">
                    <Governance />
                </Route>
                <Route path="/register">
                    {pick ? <Redirect to="/" /> : <Register {...props} />}
                </Route>
                <Route path="/r/:ref">
                    {pick ? <Redirect to="/" /> : <Register {...props} />}
                </Route>
            </Switch>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
            />
        </Layout>
    );
}

export default App;
