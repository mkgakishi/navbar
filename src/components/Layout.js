import React from "react";
import { Container } from "react-bootstrap";
import Header from "./Header";

import classes from "./Layout.module.scss";


const Layout = ({ children, ...rest }) => {
    return (
        <Container>
            <Header {...rest} />
            <div className={classes.container}>{children}</div>
        </Container>
    );
};

export default Layout;
