import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CancelAppointment = () => {
    return (
        <>
        <Navigation />
                <Nav className="ms-auto">
                 
                  <Nav.Link href="/Home" className='text-dark'>Home</Nav.Link>
                  <span style={{border:"1px solid #a6a6a6"}}></span>
                  <Nav.Link href="#" className='text-dark'>Profile</Nav.Link>
                  <span style={{border:"1px solid #a6a6a6"}}></span>
                  <Nav.Link href="#" className='text-dark'>Help & Support</Nav.Link>
                  <span style={{border:"1px solid #a6a6a6"}}></span>
                  <Nav.Link href="/Home" className='text-dark' >Log Out</Nav.Link>
                  <span style={{border:"1px solid #a6a6a6"}}></span>
                  
                  <FaBell size={20} className="mt-2" style={{color:"#A8577E", marginLeft:"1050px"}} />
                </Nav>
        </>
    );
};

export default CancelAppointment;