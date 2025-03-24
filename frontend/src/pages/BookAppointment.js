import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
import axios from 'axios';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const BookAppointment = () => {
    const location = useLocation();
    const { doctorId, doctorName, specialty, languages, hospital, address, date, startTime, endTime } = location.state || {};

    const navigate = useNavigate();
    useEffect(() => {
        if (!location.state) {
            navigate("/appointment-availability"); // Redirect if no data is passed
        }
    }, [location, navigate]);

    if (!date || !startTime || !endTime) {
        return <p>No appointment selected. Please go back and select a time slot.</p>;
    }


    return (
        <>
            <Navigation />
            <Nav className="ms-auto">
                <Nav.Link href="/Home" className='text-dark'>Home</Nav.Link>
                <span style={{ border: "1px solid #a6a6a6" }}></span>
                <Nav.Link href="#" className='text-dark'>Profile</Nav.Link>
                <span style={{ border: "1px solid #a6a6a6" }}></span>
                <Nav.Link href="#" className='text-dark'>Help & Support</Nav.Link>
                <span style={{ border: "1px solid #a6a6a6" }}></span>
                <Nav.Link href="/Home" className='text-dark' >Log Out</Nav.Link>
                <span style={{ border: "1px solid #a6a6a6" }}></span>
                <FaBell size={20} className="mt-2" style={{ color: "#A8577E", marginLeft: "1050px" }} />
            </Nav>

            <div>
                <h2>Confirm Your Appointment</h2>
                <p><strong>Doctor:</strong> {doctorName}</p>
                <p><strong>Specialty:</strong> {specialty}</p>
                <p><strong>Languages:</strong> {languages}</p>
                <p><strong>Hospital:</strong> {hospital}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Appointment Date:</strong> {date}</p>
                <p><strong>Time Slot:</strong> {startTime} - {endTime}</p>
                <button className="rounded-pill px-4"
                    style={{ backgroundColor: "#00FF00", border: "none" }}>Confirm Appointment</button>

                <button className="rounded-pill px-4"
                    style={{ backgroundColor: "#FF0000", border: "none" }} onClick={() => navigate("/patient-dashboard")}>Go back</button>

            </div>
        </>
    );
};

export default BookAppointment;