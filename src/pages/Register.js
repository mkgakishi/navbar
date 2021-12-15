import React, { useState, useEffect } from 'react';

import { Card, Image, Button, Form } from "react-bootstrap";

import { Link } from "react-router-dom";

import { useContractKit } from '@celo-tools/use-contractkit';

import classes from "./Login.module.scss";

import { toast } from 'react-toastify';


export default function Register({ contract, setPick }) {

    const [selectedId, setSelectedId] = useState(1)

    const { performActions, connect, address } = useContractKit();

    useEffect(() => {
        if (window.location.pathname.search('/r') > -1) {
            const chunk = window.location.pathname.split('/');
            if (chunk.length === 3) {
                if (!isNaN(chunk[2].trim())) {
                    setSelectedId(parseInt(chunk[2].trim()))
                }
            }
        }
    }, [])

    const handleChange = (e) => setSelectedId(e.target.value)

    const handleSubmit = async () => {
        if (address) {
            await performActions(async (kit) => {
                try {
                    const selectedAccount = await contract.methods.idToAddress(selectedId).call()
                    const price = await contract.methods.levelPrice('1').call();
                    const registrationAmount = kit.web3.utils.fromWei(price) * 2;

                    await contract.methods.registrationExt(selectedAccount).send({
                        from: address,
                        gasLimit: 3500000,
                        value: kit.web3.utils.toWei(registrationAmount.toString())
                    }).then(receipt => {                        
                        toast.success("Registration success")
                        console.log(receipt)
                        window.localStorage.setItem('pick', address)
                        setPick(address)
                    }).catch(error => {
                        console.log(error)
                        toast.error("Registration failed")
                    });
                } catch (ex) {
                    console.error(ex)
                    toast.error("Registration failed")
                }
            });
        } else {
            try {
                await connect()
            } catch (e) {
                console.log(e)
                toast.error("Connection failed")
            }
        }
    }

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
                        <div className={classes.login__card__body__form__view}>
                            <Form.Group>
                                <Form.Control type="number" placeholder="account id" value={selectedId} onChange={handleChange} />
                                <Button onClick={handleSubmit}>{address ? 'Register' : 'Connect Wallet'}</Button>
                            </Form.Group>
                        </div>
                    </div>

                    <div className={classes.login__card__body__register}>
                        <Link to="/login">sign in to safe forsage</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}
