import React, { useEffect, useState } from "react";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

import classes from "./Header.module.scss";

import { Link, useHistory } from "react-router-dom";

const Header = ({ pick, setPick, destroy, ...rest }) => {


    const history = useHistory();
    const [menuOpen, setMenuOpen] = useState(false);
    const [size, setSize] = useState({
        width: undefined,
        height: undefined,
    });

    const shortAddress = (addr) => {
        const start = addr.substr(0, 6);
        const end = addr.substr(addr.length - 4, 4);

        return `${start}...${end}`;
    }

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (size.width > 768 && menuOpen) {
            setMenuOpen(false);
        }
    }, [size.width, menuOpen]);

    const menuToggleHandler = () => {
        setMenuOpen((p) => !p);
    };

    const ctaClickHandler = () => {
        menuToggleHandler();

        if (!pick)
            history.push("/login");
        else
            history.push("/wallet")
    };

    const logout = () => {
        setPick(null)
        destroy()
        window.localStorage.clear()
        history.push("/login")
    }

    return (
        <header className={classes.header}>
            <div className={classes.header__content}>
                <Link to="/" className={classes.header__content__logo}>
                    SAFE FORSAGE
                </Link>
                <nav className={`${classes.header__content__nav} ${menuOpen && size.width < 768 ? classes.isMenu : ""
                    }`}>
                    <ul>
                        <li>
                            <Link to="/" onClick={menuToggleHandler}>
                                {pick ? 'Office' : 'Home'}
                            </Link>
                        </li>
                        <li>
                            <Link to="/reward" onClick={menuToggleHandler}>
                                Reward
                            </Link>
                        </li>
                        <li>
                            <Link to="/governance" onClick={menuToggleHandler}>
                                Governance
                            </Link>
                        </li>
                        { pick ?
                            <li onClick={logout} className={classes.header__content__nav__logout}>
                                Logout
                            </li> : ""
                        }
                    </ul>
                    <button onClick={ctaClickHandler}>{pick ? shortAddress(pick) : "Connect"}</button>
                </nav>
                <div className={classes.header__content__toggle}>
                    {!menuOpen ? (
                        <BiMenuAltRight onClick={menuToggleHandler} />
                    ) : (
                        <AiOutlineClose onClick={menuToggleHandler} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
