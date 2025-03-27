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
    const navigate = useNavigate();

    // Extract appointment details from location state
    const { doctorId, doctorName, specialty, languages, hospitalId, hospital, address, date, startTime, endTime } = location.state || {};

    //Logout functionality
    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user data from localStorage
        window.location.href = "/login"; // Redirect to login page
      };
    


    // State to store reason input
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!location.state) {
            navigate("/appointment-availability"); // Redirect if no data is passed
        }
    }, [location, navigate]);


    /*if (!date || !startTime || !endTime) {
        return <p>No appointment selected. Please go back and select a time slot.</p>;
    }*/


    // Function to handle appointment confirmation
    const handleConfirmAppointment = async () => {
        try {

            // Get logged-in user's patient_id (Assuming stored in localStorage after login)
            const userData = JSON.parse(localStorage.getItem('user'));
            

            

            const appointmentData = {
                patient_id: userData.id,
                //doctor_id: doctor._id,
                //hospital_id: hospitalId,
                appointment_date: new Date(`${date} ${startTime}`),
                status: "Scheduled",
                reason: reason
            };

            console.log("Sending appointment data:", appointmentData); // Log before sending

            // Send data to backend API
            const response = await axios.post("http://localhost:5000/appointments", appointmentData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201) {
                alert("Appointment booked successfully!");
                navigate("/patient-dashboard"); // Redirect to patient dashboard
            }
        } catch (error) {
            console.error("Error booking appointment:", error.response ? error.response.data : error.message);
            alert("Failed to book appointment. Please try again.");
        }
    };


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
                <Nav.Link href="/Home" className='text-dark' onClick={handleLogout} >Log Out</Nav.Link>
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

                {/* Reason Input */}
                <Form.Group controlId="reason" className="mx-auto w-50" style={{ marginLeft: "100px", marginRight: "100px" }}>
                    <Form.Label className="d-block text-center"><strong>Reason:</strong></Form.Label>
                    <Form.Control className="mx-auto w-50" style={{ marginLeft: "100px", marginRight: "100px", marginRight: "10px", padding: "10px" }} value={reason}
                        onChange={(e) => setReason(e.target.value)} placeholder="Enter the reason for your appointment..." required />
                </Form.Group>
                <button className="rounded-pill px-4"
                    style={{ backgroundColor: "#00FF00", border: "none" }} onClick={handleConfirmAppointment}>Confirm Appointment</button>

                <button className="rounded-pill px-4"
                    style={{ backgroundColor: "#FF0000", border: "none" }} onClick={() => navigate("/patient-dashboard")}>Go back</button>

            </div>
        </>
    );
};

export default BookAppointment;