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
    const [successMessage, setSuccessMessage] = useState("");
    const [failureMessage, setFailureMessage] = useState("");
    const [doctorNotfoundMessage, setdoctorNotfoundMessage] = useState("");
    const [hospitalNotfoundMessage, sethospitalNotfoundMessage] = useState("");

    useEffect(() => {
        if (!location.state) {
            navigate("/appointment-availability"); // Redirect if no data is passed
        }
    }, [location, navigate]);


    /*if (!date || !startTime || !endTime) {
        return <p>No appointment selected. Please go back and select a time slot.</p>;
    }*/
    console.log("Start Time:", startTime);

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
                setdoctorNotfoundMessage("Doctor not found.");
                return;
            }

            if (hospitalResponse.status !== 200 || !hospitalResponse.data || !hospitalResponse.data.hospital_id) {
                sethospitalNotfoundMessage("Hospital not found.");
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
                reason: reason,
                language: languages,
                speciality: specialty,
            };



            console.log("Sending appointment data:", appointmentData); // Log before sending

            // Send data to backend API
            const response = await axios.post( "http://localhost:5000/appointments", appointmentData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201) {
                setSuccessMessage("Appointment booked successfully!");
                setTimeout(() => navigate("/patient-dashboard"), 2000);
            }
        } catch (error) {
            console.error("Error booking appointment:", error.response ? error.response.data : error.message);
            setFailureMessage("Failed to book appointment. Please try again.");
        }
    };

    const addHoursToTime = (time, hoursToAdd) => {
        if (!time) return "Invalid Time";

        // Split "06:00 AM" into ["06:00", "AM"]
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        // Convert to 24-hour format
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        // Create Date object and add hours
        let date = new Date();
        date.setHours(hours, minutes);
        date.setHours(date.getHours() + hoursToAdd);

        // Convert back to 12-hour format
        let newHours = date.getHours() % 12 || 12;
        let newMinutes = date.getMinutes().toString().padStart(2, "0");
        let newModifier = date.getHours() >= 12 ? "PM" : "AM";

        return `${newHours}:${newMinutes} ${newModifier}`;
    };


    return (
        <>
            <Navigation />
             
            {/* Show success message if appointment is booked */}
            {successMessage && (
                <div className="alert alert-success text-center" role="alert">
                    {successMessage}
                </div>
            )}

            {/* Show failure message message if appointment is not booked */}
            {failureMessage && (
                <div className="alert alert-failure text-center" role="alert" style={{ width: "100%", backgroundColor: "#e6c5be" }}>
                    {failureMessage}
                </div>
            )}

            {/* Show doctor not found message*/}
            {doctorNotfoundMessage && (
                <div className="alert doctor-notfound text-center" role="alert" style={{ width: "100%", backgroundColor: "#e6c5be" }}>
                    {doctorNotfoundMessage}
                </div>
            )}

            {/* Show hospital not found message*/}
            {hospitalNotfoundMessage && (
                <div className="alert hospital-notfound text-center" role="alert" style={{ width: "100%", backgroundColor: "#e6c5be" }}>
                    {hospitalNotfoundMessage}
                </div>
            )}

<Container fluid style={{
                      margin: "0px", padding: "10px",
                      backgroundImage: "url('/images/1background.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      minHeight: "100vh",
                    }}>
            <div className="d-flex justify-content-center align-items-center">
                <div className="p-4 shadow-lg rounded" style={{ maxWidth: "500px", width: "100%", backgroundColor: "#f8f9fa" }}>
                    <h2>Confirm Your Appointment</h2>

                    <p><strong>Doctor:</strong> {doctorName}</p>
                    <p><strong>Specialty:</strong> {specialty}</p>
                    <p><strong>Languages:</strong> {languages}</p>
                    <p><strong>Hospital:</strong> {hospital}</p>
                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>Appointment Date:</strong> {date}</p>
                    <p><strong>Time Slot:</strong> {addHoursToTime(startTime, 4)} - {addHoursToTime(endTime, 4)}</p>



                    {/* Reason Input */}
                    <Form.Group controlId="reason" className="mx-auto w-95" style={{ marginLeft: "50px", marginRight: "50px" }}>
                        <Form.Label className="d-block text-center"><strong>Reason:</strong></Form.Label>
                        <Form.Control className="mx-auto w-80" style={{ padding: "10px", width: "100%" }} value={reason}
                            onChange={(e) => setReason(e.target.value)} placeholder="Enter reason for appointment" required />
                    </Form.Group>
                    
                   {/* Buttons Container */}
                   <div className="text-center mt-3">
                        <button className="rounded-pill px-4 w-50 d-block mx-auto"
                            style={{ backgroundColor: "#A8577E", border: "none", marginBottom: "10px", color: "#FFFFFF" }}
                            onClick={handleConfirmAppointment}>Confirm Appointment</button>

                        <button className="rounded-pill px-4 w-50 d-block mx-auto"
                            style={{ backgroundColor: "#FF0000", border: "none", color: "#FFFFFF" }}
                            onClick={() => navigate("/patient-dashboard")}>Go back</button>
                    </div>
                </div>
            </div>
            </Container>
        </>
    );
};

export default BookAppointment;