import React, { useState, useEffect, useCallback } from "react";
import { Card, Spinner, Image, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { AiOutlineBackward, AiOutlineCopy, AiOutlineForward } from "react-icons/ai";

import ThreeMatrix from "../components/ThreeMatrix";
import SixMatrix from "../components/SixMatrix";

import classes from "./Office.module.scss";
import BuySlot from "../components/BuySlot";
import { toast } from "react-toastify";

const colors = {
    $red: "rgba(241, 32, 32, 0.7)",
    $redLight: "rgba(240, 81, 81, 0.7)",
    $green: "rgba(4, 119, 39, 0.7)",
    $greenLight: "rgba(124, 204, 148, 0.7)",
    $orange: "rgba(216, 159, 54, 0.7)",
    $orangeLight: "rgba(224, 188, 120, 0.7)",
    $blue: "rgba(12, 101, 218, 0.7)",
    $blueLight: "rgba(119, 169, 235, 0.7)"
}

const SlotInfo = ({ matrix, index, slot, address, contract, kit, setPick, user }) => {

    const [enabled, setEnabled] = useState(false)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState(0)
    const [reward, setReward] = useState(0)
    const [upgrade, setUpgrade] = useState(0)

    const buyLevel = async (x, s, p) => {
        try {
            await contract.methods.buyNewLevel(x === 'x3' ? 1 : 2, s).send({
                from: address,
                gasLimit: 1000000,
                value: kit.web3.utils.toWei(p.toString())
            })
        } catch (ex) {
            console.log(ex)
        }
    }

    const render = (x, d, e, s, p = 0, u = 0, us = null) => {
        if (x === 'x3' && e) {
            return <ThreeMatrix data={d} slot={s} upgrade={u} user={us} />
        } else if (matrix === 'x6' && enabled) {
            return <SixMatrix data={d} slot={s} upgrade={u} user={us} />
        } else {
            return <BuySlot reward={reward} address={address} setPick={setPick} data={data} slot={s} price={p} buyLevel={() => buyLevel(x, s, p)} kit={kit} />
        }
    }
    const loadSlotInfo = useCallback(async () => {
        setLoading(true)

        const rewardPrice = await contract.methods.rewardPerCredit().call();
        setReward(kit.web3.utils.fromWei(rewardPrice) * slot.slot);

        if (matrix === 'x3') {
            const {
                blocked,
                currentReferrer,
                enabled,
                fee,
                price,
                referrals,
                reinvestCount
            } = await contract.methods.usersX3Matrix(address, slot.slot).call();
            setEnabled(enabled);
            setUpgrade(reinvestCount);
            setPrice(kit.web3.utils.fromWei(price));
            setData({ blocked, currentReferrer, enabled, fee, price, referrals, reinvestCount })
            setLoading(false)
        } else {
            const {
                blocked,
                closedPart,
                currentReferrer,
                enabled,
                fee,
                firstLevelReferrals,
                price,
                reinvestCount,
                secondLevelReferrals
            } = await contract.methods.usersX6Matrix(address, slot.slot).call();
            setEnabled(enabled);
            setUpgrade(reinvestCount);
            setPrice(kit.web3.utils.fromWei(price));
            setData({ blocked, closedPart, currentReferrer, enabled, fee, firstLevelReferrals, price, reinvestCount, secondLevelReferrals })
            setLoading(false)
        }
    }, [contract, kit, slot, address, matrix]);

    useEffect(() => loadSlotInfo(), [loadSlotInfo])

    return (
        <Card key={`${matrix}_${index}`} className={classes.office__matrix__wrapper__container__slots__slot}>
            {loading ? <Spinner animation="border" role="status" style={{ color: "lightgray" }}></Spinner> : render(matrix, data, enabled, slot.slot, price, upgrade, user)}
        </Card>
    )
}

function CardLayout({ info, classes }) {
    return (
        <Card className={`${classes.office__cards__info}`} style={{ backgroundColor: info.color }}>
            <span className={classes.office__cards__info__label}>{info.label}</span>
            <span style={{ fontSize: "11px" }} className={`${classes.office__cards__info__count}`}>{info.count}</span>
        </Card>
    )
}

const Office = ({ pick, contract, kit, connect, setPick }) => {

    const [user, setUser] = useState(null)
    const [count, setCount] = useState(0)
    const [today, setToday] = useState(0)
    const [rewards, setRewards] = useState(0)
    const [earnings, setEarnings] = useState({ x3: 0, x6: 0 })
    const [totalEarnings, setTotalEarnings] = useState(0)
    const [userRewards, setUserRewards] = useState(0)
    const [dollarRate, setDollarRate] = useState(0)
    const [celoImages, setCeloImages] = useState({})

    const cardInfo = [
        { label: "ALL PARTICIPANTS", count: count, color: `rgba(${colors.$redLight},0.6)`, title: colors.$red },
        { label: "TOTAL REWARDS", count: `${rewards} FORS`, color: colors.$greenLight, title: colors.$green },
        { label: "EARNED IN CELO", count: `${totalEarnings} CELO`, color: colors.$orangeLight, title: colors.$orange },
        { label: "JOINED LAST 24HR", count: today, color: colors.$blueLight, title: colors.$blue },
        { label: "EARNED IN USD", count: `$ ${(totalEarnings * dollarRate).toFixed(2)}`, color: colors.$blueLight, title: colors.$blue },

    ];

    const [slots] = useState([
        { slot: 1, price: 0 },
        { slot: 2, price: 0 },
        { slot: 3, price: 0 },
        { slot: 4, price: 0 },
        { slot: 5, price: 0 },
        { slot: 6, price: 0 },
        { slot: 7, price: 0 },
        { slot: 8, price: 0 },
        { slot: 9, price: 0 },
        { slot: 10, price: 0 },
        { slot: 11, price: 0 },
        { slot: 12, price: 0 }
    ])

    const showStats = () => alert("stats")

    const loadUserInfo = useCallback(async () => {
        const userInfo = await contract.methods.getInfo(pick).call();
        const { _id, _partners, _totalEarnings, _totalRewards, _userCount, _x3Earnings, _x6Earnings, _userReward } = userInfo;

        setUser({ address: pick, id: _id, partnersCount: _partners });
        setCount(_userCount);
        setTotalEarnings(kit.web3.utils.fromWei(_totalEarnings.toString()));
        setRewards(kit.web3.utils.fromWei(_totalRewards.toString()));
        setEarnings({ x3: kit.web3.utils.fromWei(_x3Earnings.toString()), x6: kit.web3.utils.fromWei(_x6Earnings.toString()) })
        setUserRewards(kit.web3.utils.fromWei(_userReward))

        const currentBlock = await kit.web3.eth.getBlockNumber();
        const last24hrsEvents = await contract.getPastEvents("Registration", {
            fromBlock: currentBlock - 17280,
            toBlock: 'latest'
        })
        setToday(last24hrsEvents.length)

        /*
        const transferEvents = await contract.getPastEvents("Transfer", {
            filter: { from: '0x0000000000000000000000000000000000000000', to: pick },
            fromBlock: 0,
            toBlock: 'latest',
        })*/

    }, [contract, pick, kit]);

    useEffect(() => {
        fetch("https://api.coingecko.com/api/v3/coins/celo?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false")
            .then(response => response.json())
            .then(response => {
                setCeloImages(response.image)
                setDollarRate(response.market_data.current_price.usd)
            })
    }, [])

    useEffect(() => loadUserInfo(), [loadUserInfo])

    const copy = (item) => {
        window.navigator.clipboard.writeText(item);
        toast.success("Copied to clipboard")
    }

    return (
        <div className={classes.office}>
            <div className={classes.office__stats}>
                <h5>Back Office</h5>
                <button onClick={showStats}>stats</button>
            </div>
            <div className={classes.office__cards}>
                {
                    cardInfo.map((info, index) => <CardLayout classes={classes} info={info} key={index} />)
                }
            </div>
            <div className={classes.office__matrix}>
                <div className={classes.office__matrix__wrapper}>
                    <div className={classes.office__matrix_cards}>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>ID</span>
                                <span className={classes.office__matrix_cards__side__body__last}>{user?.id}</span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>PARTNERS</span>
                                <span className={classes.office__matrix_cards__side__body__last}>{user && user.partnersCount}</span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>CELO PRICE</span>
                                <span className={classes.office__matrix_cards__side__body__last}>${dollarRate}</span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>REWARDS</span>
                                <span className={classes.office__matrix_cards__side__body__last}>{userRewards} FORS</span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>X3 EARNINGS</span>
                                <span className={classes.office__matrix_cards__side__body__last}>{earnings && earnings.x3} CELO</span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>X4 EARNINGS</span>
                                <span className={classes.office__matrix_cards__side__body__last}>{earnings && earnings.x6} CELO</span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>ACCOUNT ADDRESS</span>
                                <span className={classes.office__matrix_cards__side__body__last}>
                                    <OverlayTrigger
                                        placement='bottom'
                                        overlay={
                                            <Tooltip id="tooltip-pick">
                                                <div>{pick}</div>
                                                <div>click to copy</div>
                                            </Tooltip>
                                        }>
                                        <Button  onClick={() => copy(pick)} variant="default" size="sm"><AiOutlineCopy className={classes.office__matrix_cards__side__body__last__hover} /></Button>
                                    </OverlayTrigger>
                                </span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>SMART CONTRACT</span>
                                <span className={classes.office__matrix_cards__side__body__last}>
                                    <OverlayTrigger
                                        placement='bottom'
                                        overlay={
                                            <Tooltip id="tooltip-matrix">
                                                <div>{process.env.REACT_APP_MATRIX_ADDRESS}</div>
                                                <div>click to copy</div>
                                            </Tooltip>
                                        }>
                                        <Button onClick={() => copy(process.env.REACT_APP_MATRIX_ADDRESS)} variant="default" size="sm"><AiOutlineCopy className={classes.office__matrix_cards__side__body__last__hover} /></Button>
                                    </OverlayTrigger>
                                </span>
                            </Card.Body>
                        </Card>
                        <Card className={classes.office__matrix_cards__side}>
                            <Card.Body className={classes.office__matrix_cards__side__body}>
                                <span>REFFERAL LINK</span>
                                <span className={classes.office__matrix_cards__side__body__last}>
                                <OverlayTrigger
                                        placement='bottom'
                                        overlay={
                                            <Tooltip id="tooltip-referal">
                                                <div>click to copy</div>
                                            </Tooltip>
                                        }>
                                        <Button onClick={() => copy(`${window.location.origin}/r/${user.id}`)} variant="default" size="sm"><AiOutlineCopy className={classes.office__matrix_cards__side__body__last__hover} /></Button>
                                    </OverlayTrigger>
                                </span>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                <div className={classes.office__matrix__wrapper}>
                    <Card className={classes.office__matrix__wrapper__container}>
                        <div className={classes.office__matrix__wrapper__container__title}>{celoImages && <Image style={{ marginRight: "0.5rem", borderRadius: "1rem" }} src={celoImages.thumb} />} <span>X3 SMART MATRIX</span></div>
                        <div className={classes.office__matrix__wrapper__container__slots}>
                            {
                                slots.map((slot, index) => <SlotInfo user={user} key={index} matrix="x3" index={index} slot={slot} address={pick} contract={contract} kit={kit} connect={connect} setPick={setPick} />)
                            }
                        </div>
                    </Card>
                    <Card className={classes.office__matrix__wrapper__container}>
                        <div className={classes.office__matrix__wrapper__container__title}>{celoImages && <Image style={{ marginRight: "0.5rem", borderRadius: "1rem" }} src={celoImages.thumb} />}<span>X4 SMART MATRIX</span></div>
                        <div className={classes.office__matrix__wrapper__container__slots}>
                            {
                                slots.map((slot, index) => <SlotInfo user={user} key={index} matrix="x6" index={index} slot={slot} address={pick} contract={contract} kit={kit} connect={connect} setPick={setPick} />)
                            }
                        </div>
                        <div className={classes.office__matrix__wrapper__container__info}>
                            <span><AiOutlineForward color="green" />REWARD</span>
                            <span><AiOutlineBackward color="red" />FEE</span>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Office;
