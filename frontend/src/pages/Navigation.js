

import React from 'react';
// import { Link } from 'react-router-dom';
import { Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {

    return (
        <>
    <Navbar expand="lg" className="px-4 py-3 m-0" style={{ backgroundColor: "#F7D9E1" }}>
            <Navbar.Brand href="#">
              <img src="../images/Logo.png" alt="Logo" width="100" className="me-2" />
              <strong style={{fontSize:"30px"}}>Carella Connect</strong> <span style={{fontSize:"12px"}}>Bridging the Gap in Healthcare!</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
            <Nav>
                <strong>Welcome!!</strong>
            </Nav>
            </Navbar.Collapse>
    </Navbar>
    </>
    );
};

export default Navigation;