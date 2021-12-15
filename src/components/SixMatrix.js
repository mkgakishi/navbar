import React, { useState } from 'react'

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { FaRecycle, FaUsers } from "react-icons/fa"

import classes from "./SixMatrix.module.scss";

export default function SixMatrix({ data, slot, upgrade }) {

    const colors = { stroke: 'rgba(171, 173, 177, 0.5)' }

    const [toastInfo, setToastInfo] = useState('')

    const showToast = (level, info, root = null) => {
        if (root && data.currentReferrer !== '0x0000000000000000000000000000000000000000') {
            setToastInfo(data.currentReferrer)
        } if (level === 1 && data.firstLevelReferrals[info]) {
            setToastInfo(data.firstLevelReferrals[info])
        } else if (level === 2 && data.secondLevelReferrals[info]) {
            setToastInfo(data.secondLevelReferrals[info])
        } else {
            setToastInfo('')
        }
    }

    const navigateTo = (level, info) => {
        if (level === 1 && data.firstLevelReferrals[info]) {
            window.localStorage.setItem('pick', data.firstLevelReferrals[info])
            window.location = "/"
        } else if (level === 2 && data.secondLevelReferrals[info]) {
            window.localStorage.setItem('pick', data.secondLevelReferrals[info])
            window.location = "/"
        } else {
            return '';
        }
    }
    const navigate = (info) => {
        window.localStorage.setItem('pick', info)
        window.location = "/"
    }
    const getCssClass = (level, info) => {
        if (level === 1 && data.firstLevelReferrals[info]) {
            return classes.slotcircle
        } else if (level === 2 && data.secondLevelReferrals[info]) {
            return classes.slotcircle
        } else {
            return '';
        }
    }

    console.log(slot, data)


    return (
        <div className={classes.wrapper}>
            <div className={classes.wrapper__title}>{`SLOT  ${slot}`}</div>
            <div className={classes.wrapper__first}>
                <OverlayTrigger
                    placement='top'
                    overlay={
                        <Tooltip id="tooltip">
                            {toastInfo}
                        </Tooltip>
                    }>
                    <svg width="140" height="150">
                        <line x1={70} y1={41} x2={100} y2={60} stroke={colors.stroke} strokeDasharray="2,2" strokeWidth="2" fill="transparent" />
                        <line x1={60} y1={41} x2={28} y2={60} stroke={colors.stroke} strokeDasharray="2,2" strokeWidth="2" fill="transparent" />

                        <line x1={15} y1={107} x2={25} y2={88} stroke={colors.stroke} strokeDasharray="2,2" strokeWidth="2" fill="transparent" />
                        <line x1={47} y1={107} x2={35} y2={88} stroke={colors.stroke} strokeDasharray="2,2" strokeWidth="2" fill="transparent" />
                        <line x1={125} y1={107} x2={110} y2={88} stroke={colors.stroke} strokeDasharray="2,2" strokeWidth="2" fill="transparent" />
                        <line x1={85} y1={107} x2={100} y2={88} stroke={colors.stroke} strokeDasharray="2,2" strokeWidth="2" fill="transparent" />

                        <circle onClick={() => navigate(data.currentReferrer)} onMouseEnter={() => showToast(0, 0, data[0])} cx={65} cy={28} r={14} stroke="rgba(107, 151, 235, 0.5)" strokeWidth="1" fill="rgba(107, 151, 235, 0.5)" className={classes.slotmain} />

                        <circle onClick={() => navigateTo(1, 0, true)} onMouseEnter={() => showToast(1, 0)} cx={30} cy={74} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(1, 0)} />
                        <circle onClick={() => navigateTo(1, 0, true)} onMouseEnter={() => showToast(1, 1)} cx={102} cy={74} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(1, 1)} />

                        <circle onClick={() => navigateTo(2, 0, true)} onMouseEnter={() => showToast(2, 0)} cx={15} cy={120} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(2, 0)} />
                        <circle onClick={() => navigateTo(2, 1, true)} onMouseEnter={() => showToast(2, 1)} cx={47} cy={120} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(2, 1)} />
                        <circle onClick={() => navigateTo(2, 2, true)} onMouseEnter={() => showToast(2, 2)} cx={90} cy={120} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(2, 2)} />
                        <circle onClick={() => navigateTo(2, 3, true)} onMouseEnter={() => showToast(2, 3)} cx={123} cy={120} r={14} stroke={colors.stroke} strokeWidth="2" fill="transparent" className={getCssClass(2, 3)} />
                    </svg>
                </OverlayTrigger>
            </div>
            <div className={classes.wrapper__count}>
                <span><FaUsers style={{ color: "gray", width: "28px" }} /> {data && [...data.firstLevelReferrals, ...data.secondLevelReferrals].length}</span>
                <span><FaRecycle style={{ color: "gray", width: "28px" }} /> {upgrade}</span>
            </div>
            <div className={classes.wrapper__tick}></div>
        </div >
    )
}

