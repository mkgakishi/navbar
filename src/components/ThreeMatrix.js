import React from 'react'

import { FaRecycle, FaUsers } from "react-icons/fa"

import classes from "./ThreeMatrix.module.scss";

const colors = { stroke: 'rgba(171, 173, 177, 0.5)' }

export default function ThreeMatrix({ data, slot, upgrade, user }) {

    const showToast = (info, child) => {
        if (!child && info !== '0x0000000000000000000000000000000000000000') {
        } else if (data && data.referrals[info]) {
        } else {
        }
    }

    const navigateTo = (info, child = false) => {
        if (!child && info !== '0x0000000000000000000000000000000000000000') {
            window.localStorage.setItem('pick', info)
            window.location = "/"
        } else if (data && data.referrals[info]) {
            window.localStorage.setItem('pick', data.referrals[info])
            window.location = "/"
        } else {
            return '';
        }
    }

    const getCssClass = (info) => data && data.referrals[info] ? classes.slotcircle : ''

    return (
        <div className={classes.wrapper}>
            <div className={classes.wrapper__title}>{`SLOT  ${slot}`}</div>
            <div className={classes.wrapper__first}>
                <svg width="133" height="120">
                    <line x1={76} y1={41} x2={114} y2={70} strokeDasharray="2,2" stroke={colors.stroke} strokeWidth="2" fill="gray" />
                    <line x1={71} y1={41} x2={71} y2={70} strokeDasharray="2,2" stroke={colors.stroke} strokeWidth="2" fill="gray" />
                    <line x1={65} y1={41} x2={28} y2={70} strokeDasharray="2,2" stroke={colors.stroke} strokeWidth="2" fill="gray" />

                    <circle onClick={() => navigateTo(data.currentReferrer, false)} onMouseEnter={() => showToast(data && data[0])} cx={71} cy={28} r={14} stroke="rgba(107, 151, 235, 0.5)" strokeWidth="2" fill="rgba(107, 151, 235, 0.5)" className={classes.slotmain} />
                    <circle onClick={() => navigateTo(0, true)} onMouseEnter={() => showToast(0, true)} cx={28} cy={84} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(0)} />
                    <circle onClick={() => navigateTo(1, true)} onMouseEnter={() => showToast(1, true)} cx={71} cy={84} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(1)} />
                    <circle onClick={() => navigateTo(2, true)} onMouseEnter={() => showToast(2, true)} cx={114} cy={84} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(2)} />
                </svg>
            </div>
            <div className={classes.wrapper__count}>
                <span><FaUsers style={{ color: "gray", width: "28px" }} /> {slot === 1 ? user.partnersCount : data.referrals.length}</span>
                <span><FaRecycle style={{ color: "gray", width: "28px" }} /> {upgrade}</span>
            </div>
            <div className={classes.wrapper__tick}></div>
        </div>
    )
}
