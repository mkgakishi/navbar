import React from 'react'

import classes from "./NotEnabled.module.scss";

export default function NotEnabled({ slot, price, buyLevel}) {
    return (
        <div className={classes.wrapper}>
            <h3>NOT ENABLED</h3>
        </div>
    )
}
