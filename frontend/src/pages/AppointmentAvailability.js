import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import axios from 'axios';

const AppointmentAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialSpecialty = searchParams.get("specialty") || "";
  const initialLanguage = searchParams.get("language") || "";

  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [language, setLanguage] = useState(initialLanguage);
  const [doctors, setDoctors] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({}); // Stores selected slot per doctor

  //Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    window.location.href = "/login"; // Redirect to login page
  };


  useEffect(() => {
    if (specialty && language) {
      fetchDoctors();
    }
  }, [specialty, language]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`/filtered-doctors?specialty=${specialty}&language=${language}`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Handle dropdown selection
  const handleSlotSelection = (doctorId, slotValue) => {
    setSelectedSlots(prev => ({
      ...prev,
      [doctorId]: slotValue,
    }));
  };

  const handleBookAppointment = (doctor) => {
    if (!selectedSlots[doctor._id]) {
      alert("Please select a time slot before booking.");
      return;
    }

    // Extract selected slot details
    const [date, startTime, endTime] = selectedSlots[doctor._id].split("|");

    // Navigate to the booking page with all details
    navigate("/book-appointment", {
      state: {
        doctorId: doctor._id,
        doctorName: doctor.doctor_name,
        specialty: doctor.speciality,
        languages: doctor.languages.join(", "),
        hospital: doctor.hospital_name,
        address: doctor.hospital_address,
        date,
        startTime,
        endTime,
      },
    });
  };

  return (
    <>
      <Navigation />
      
      <Container className="mt-4">
        <h2>
          {specialty && language ? `Find a ${language} speaking ${specialty}` : "Find a Doctor"}
        </h2>
        <Row>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Col md={12} key={doctor._id} className="mb-3">
                <Card className="shadow-sm p-3">
                  <Card.Body>
                    <Row>
                      {/* Left Section */}
                      <Col md={6}>
                        <p><strong>Doctor:</strong> {doctor.doctor_name}</p>
                        <p><strong>Specialty:</strong> {doctor.speciality}</p>
                        <p><strong>Languages:</strong> {doctor.languages.join(", ")}</p>
                        <p><strong>Hospital:</strong> {doctor.hospital_name || "N/A"}</p>
                        <p><strong>Address:</strong> {doctor.hospital_address || "N/A"}</p>
                      </Col>

                      {/* Middle Section */}
                      <Col md={4}>
                        <p><strong>Availability:</strong></p>
                        {doctor.availability.length > 0 ? (
                          <Form.Select
                            onChange={(e) => handleSlotSelection(doctor._id, e.target.value)}
                            value={selectedSlots[doctor._id] || ""}
                          >
                            <option value="">Select a Date & Time</option>
                            {doctor.availability.map((avail) =>
                              avail.time_slots.map((slot, i) => (
                                <option
                                  key={`${avail.date}-${i}`}
                                 value={`${avail.date}|${slot.start_time}|${slot.end_time}`}
                                 
                                >
                                  {avail.date} | {slot.start_time} - {slot.end_time}
                                </option>
                              ))
                            )}
                          </Form.Select>
                        ) : (
                          <p>No available slots</p>
                        )}
                      </Col>

                      {/* Right Section */}
                      <Col md={2} className="text-end">
                        <Button
                          className="rounded-pill px-4"
                          style={{ backgroundColor: "#A8577E", border: "none" }}
                          onClick={() => handleBookAppointment(doctor)}
                          disabled={!selectedSlots[doctor._id]}
                        >
                          Book Appointment
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No doctors found for the selected criteria.</p>
          )}
        </Row>
      </Container>
    </>
  );
};

export default AppointmentAvailability;