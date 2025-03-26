import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {

  const [userName, setUserName] = useState('');

    useEffect(() => {
        // Retrieve user details from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.name) {
            setUserName(userData.name);
        }
    }, []);

    return (
        <>
    <Navbar expand="lg" className="px-4 py-3 m-0" style={{ backgroundColor: "#F7D9E1" }}>
            <Navbar.Brand href="#">
              <img src="../images/Logo.png" alt="Logo" width="100" className="me-2" />
              <strong style={{fontSize:"30px"}}>Carella Connect</strong> <span style={{fontSize:"12px"}}>Bridging the Gap in Healthcare!</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
            {userName && (
                        <Nav className="ms-auto">
                            <span className="me-3 fw-bold">Welcome, {userName}!</span>
                        </Nav>
                    )}
            </Navbar.Collapse>
    </Navbar>
    </>
    );
};

export default Navigation;