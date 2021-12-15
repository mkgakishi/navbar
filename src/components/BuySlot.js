import { useContractKit } from '@celo-tools/use-contractkit';
import React from 'react'

import { Button } from "react-bootstrap";
import { FaCartPlus } from 'react-icons/fa';

import classes from "./BuySlot.module.scss";

export default function BuySlot({ data, slot, reward, price, buyLevel, setPick }) {

    const { address, connect } = useContractKit();

    const handleConnect = () => {
        connect().then(() => {
            window.localStorage.setItem('pick', window.localStorage.getItem("use-contractkit/last-used-address"))
            setPick(window.localStorage.getItem("use-contractkit/last-used-address"))
        }).catch((e) => {
        })
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.wrapper__title}>{`SLOT  ${slot}`}</div>
            <div className={classes.wrapper__first}>
                <div className={classes.wrapper__first__price}>{price} CELO</div>
                <div className={classes.wrapper__first__fees}>
                    <span>Fee: {price*0.02} CELO</span>
                    <span>Reward: {reward} FORS</span>
                </div>
                <div className={classes.wrapper__first__button}>
                    <Button size="sm" variant="warning" onClick={ address ? buyLevel : handleConnect }>
                       { address ? <><FaCartPlus />  BUY SLOT</> : 'CONNECT'}</Button>
                </div>
            </div>
        </div>
    )
}
