import React, { useState } from "react";

import { Card, Image, Button, Form, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

import { toast } from "react-toastify";

import classes from "./Login.module.scss";


import { isNumber } from "./../helpers";

const Login = ({ connect, setPick, address, pick, kit, contract, ...rest }) => {

    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const handleChange = (e) => setValue(e.target.value);
    const handleView = async (e) => {
        setLoading(true)
        if (value.length === 42) {
            if (kit.web3.utils.checkAddressChecksum(value)) {
                const account = await contract.methods.isUserExists(value).call();
                if (!account) {
                    toast.error(`Account not found`);
                } else {
                    savePickLocally(value)
                    setPick(value)
                }
            } else {
                toast.error(`Invalid address`)
            }
        } else if (isNumber(value)) {
            try {
                const account = await contract.methods.idToAddress(parseInt(value)).call()
                if (account.split('').filter(s => s === '0').length === 41) {
                    toast.error(`Account not found`)
                } else {
                    savePickLocally(account)
                    setPick(account)
                }
            } catch (e) {
                setLoading(false)
                toast.error(`Network error`)
            }
        } else {
            toast.error(`Invalid address or id`)
        }

        setLoading(false)
    }

    const savePickLocally = (value) => {
        window.localStorage.setItem("pick", value);
    }

    const handleConnect = () => {
        connect().then(() => {
            const userAddress = window.localStorage.getItem("use-contractkit/last-used-address");
            contract.methods.isUserExists(userAddress).call().then(res => {
                if (res) {
                    savePickLocally(userAddress)
                    setPick(userAddress)
                } else {
                    history.push("/register")
                }
            }).catch((e) => {
                toast.error('Wallet connection terminated.');                
            })
        }).catch((e) => {
            toast.error('Wallet connection terminated.');
        })
    }

    const props = loading ? { disabled: true } : {}

    return (
        <div className={classes.login}>
            <Card className={classes.login__card}>
                <Card.Body className={classes.login__card__body}>
                    <div className={classes.login__card__body__header}>
                        <Image src="/logo192.png" />
                        <h2>SAFE FORSAGE</h2>
                        <i>"smart matrix made smart"</i>
                    </div>
                    <div className={classes.login__card__body__form}>
                        <div className={classes.login__card__body__form__connect}>
                            <Button variant="warning" onClick={handleConnect}>Connect Wallet</Button>
                        </div>
                        <div className={classes.login__card__body__form__view}>
                            <Form.Group>
                                <Form.Control type="text" placeholder="id or address" value={value} onChange={handleChange} />
                                <Button onClick={handleView} {...props}>{loading ? <span><Spinner animation="border" role="status" style={{ width: "15px", height: "15px" }}></Spinner>&nbsp;searching</span> : 'VIEW ACCOUNT'}</Button>
                            </Form.Group>
                        </div>
                    </div>

                    <div className={classes.login__card__body__register}>
                        <Link to="/register">sign up to safe forsage</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
};

export default Login;
