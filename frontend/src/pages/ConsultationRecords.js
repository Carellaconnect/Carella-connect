import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
import axios from 'axios';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const ConsultationRecords = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const doctorName = queryParams.get("doctorName");
    const hospitalName = queryParams.get("hospitalName");
    const appointmentId = queryParams.get("appointmentId");

    const [medicalRecord, setMedicalRecord] = useState(null);
    const [error, setError] = useState("");


    //Handle going back to /patient-dashboard on clicking on Go back button
    const goBack = () => {
        // Navigate to the /patient-dashboard page for the logged in user
        navigate(`/patient-dashboard`);
    };

    // Fetch Medical Record from Database
    useEffect(() => {
        const fetchMedicalRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/medicalrecords/${appointmentId}`);
                setMedicalRecord(response.data);
            } catch (err) {
                setError("Failed to fetch medical records.");
            }
        };

        if (appointmentId) {
            fetchMedicalRecord();
        }
    }, [appointmentId]);

    return (
        <>
            <Navigation />
            <Container fluid style={{
                      margin: "0px", padding: "10px",
                      backgroundImage: "url('/images/1background.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      minHeight: "100vh",
                    }}>
            <Container style={{ paddingTop: "50px", maxWidth: "600px", margin: "auto" }}>
                <h2 className="consultation-heading">Consultation Records</h2>
                <Card className="shadow-sm p-3 text-left">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div style={{ textAlign: "left" }}>
                        <p><strong>Doctor Name:</strong> {doctorName}</p>
                        <p><strong>Hospital Name:</strong> {hospitalName}</p>

                        {medicalRecord ? (
                            <div>
                                {/* Format the date and time */}
                                {(() => {
                                    const appointmentDate = new Date(medicalRecord.appointmentDate);

                                    // Add 4 hours to the time
                                    appointmentDate.setHours(appointmentDate.getHours() + 4);

                                    const formattedDate = appointmentDate.toISOString().split("T")[0]; // YYYY-MM-DD
                                    const hours = appointmentDate.getHours();
                                    const minutes = appointmentDate.getMinutes();
                                    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

                                    return (
                                        <>
                                            <p><strong>Date:</strong> {formattedDate}</p>
                                            <p><strong>Time:</strong> {formattedTime}</p>
                                        </>
                                    );
                                })()}

                                <p><strong>Allergies:</strong> {medicalRecord.allergies}</p>
                                <p><strong>Diagnosis:</strong> {medicalRecord.diagnosis}</p>
                                <p><strong>Medication:</strong> {medicalRecord.medication}</p>
                            </div>
                        ) : (
                            <p>Loading medical records...</p>
                        )}
                    </div>

                    {/* Centering the button */}
                    <div className="text-center mt-3">
                        <Button className="rounded-pill px-4" style={{ backgroundColor: "#A8577E", border: "none", width: "30%" }} onClick={() => goBack()}>Dashboard</Button>
                    </div>
                </Card>
            </Container>

            </Container>

        </>

    );
};

export default ConsultationRecords;