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
            // Get logged-in user's patient_id
            const userData = JSON.parse(localStorage.getItem('user'));

            if (!userData || !userData.id) {
                alert("User not found. Please log in again.");
                return;
            }

            console.log("Fetching doctor ID for:", doctorName); // Debugging log

            console.log("Fetching hospital ID for:", hospital); // Debugging log

            // Fetch doctor_id from the new API endpoint
            const doctorResponse = await axios.get(`http://localhost:5000/get-doctor-id/${encodeURIComponent(doctorName)}`);

            // Fetch hospital_id from the new API endpoint
            const hospitalResponse = await axios.get(`http://localhost:5000/get-hospital-id/${encodeURIComponent(hospital)}`);

            if (doctorResponse.status !== 200 || !doctorResponse.data || !doctorResponse.data.doctor_id) {
                alert("Doctor not found.");
                return;
            }

            if (hospitalResponse.status !== 200 || !hospitalResponse.data || !hospitalResponse.data.hospital_id) {
                alert("Hospital not found.");
                return;
            }

            const doctorId = doctorResponse.data.doctor_id; // Extract doctor_id from response

            const hospitalId = hospitalResponse.data.hospital_id //Extract hospital_id from response

            console.log("Doctor ID retrieved:", doctorId); // Debugging log
            console.log("Hospital ID retrieved:", hospitalId); // Debugging log

            // Prepare appointment data
            const appointmentData = {
                patient_id: userData.id,
                doctor_id: doctorId, // Now using the fetched doctor_id
                hospital_id: hospitalId,
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
                navigate("/patient-dashboard");
            }
        } catch (error) {
            console.error("Error booking appointment:", error.response ? error.response.data : error.message);
            alert("Failed to book appointment. Please try again.");
        }
    };


    return (
        <>
            <Navigation />
            

            <div className="d-flex justify-content-center align-items-center mt-3">
                <div className="p-4 shadow-lg rounded" style={{ maxWidth: "500px", width: "100%", backgroundColor: "#f8f9fa" }}>
                    <h2>Confirm Your Appointment</h2>

                    <p><strong>Doctor:</strong> {doctorName}</p>
                    <p><strong>Specialty:</strong> {specialty}</p>
                    <p><strong>Languages:</strong> {languages}</p>
                    <p><strong>Hospital:</strong> {hospital}</p>
                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>Appointment Date:</strong> {date}</p>
                    <p><strong>Time Slot:</strong> {startTime} - {endTime}</p>
                    

                   
                    {/* Reason Input */}
                    <Form.Group controlId="reason" className="mx-auto w-95" style={{ marginLeft: "50px", marginRight: "50px" }}>
                        <Form.Label className="d-block text-center"><strong>Reason:</strong></Form.Label>
                        <Form.Control className="mx-auto w-80" style={{ padding: "10px", width: "100%"}} value={reason}
                            onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for appointment" required />
                    </Form.Group>
                    <button className="rounded-pill px-4"
                        style={{ backgroundColor: "#00FF00", border: "none", marginTop: "20px" }} onClick={handleConfirmAppointment}>Confirm Appointment</button>

                    <button className="rounded-pill px-4"
                        style={{ backgroundColor: "#FF0000", border: "none", marginTop: "20px" }} onClick={() => navigate("/patient-dashboard")}>Go back</button>
                </div>
            </div>

        </>
    );
};

export default BookAppointment;