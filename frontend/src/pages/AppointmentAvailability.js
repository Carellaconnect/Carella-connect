import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
import axios from 'axios';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
//import DoctorProfile from '../../../backend/server';



const AppointmentAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialSpecialty = searchParams.get("specialty") || "";
  const initialLanguage = searchParams.get("language") || "";

  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [language, setLanguage] = useState(initialLanguage);
  const [doctors, setDoctors] = useState([]);

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

  const handleFindClick = () => {
    navigate(`/appointment-availability?specialty=${specialty}&language=${language}`);
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
        <Nav.Link href="/Home" className='text-dark' >Log Out</Nav.Link>
        <span style={{ border: "1px solid #a6a6a6" }}></span>

        <FaBell size={20} className="mt-2" style={{ color: "#A8577E", marginLeft: "1050px" }} />

      </Nav>

      {/* Section to display the list of doctors for selected specialty and language */}
      <Container className="mt-4">
        <h4>
          {specialty && language ? `Find a ${specialty} speaking ${language}` : "Find a Doctor"}
        </h4>
        <Row>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Col md={12} key={doctor._id} className="mb-3">
                <Card className="shadow-sm p-3">
                  <Card.Body>
                    <Row>
                      {/*Left section*/}
                      <Col md={6}>

                        <p><strong>Doctor:</strong>
                          {doctor.doctor_name}
                        </p>

                        <p><strong>Speciality:</strong> {doctor.speciality}</p>
                        <p><strong>Languages:</strong> {doctor.languages.join(", ")}</p>
                        <p><strong>Hospital:</strong> {doctor.hospital_name || "N/A"} </p>
                        <p><strong>Address:</strong> {doctor.hospital_address || "N/A"} </p>
                      </Col>

                      {/*Middle section*/}
                      <Col md={4}>
                        <p><strong>Availability:</strong></p>

                        {doctor.availability.length > 0 ? (
                          doctor.availability.map((avail, index) => (
                            <div key={index}>
                              <strong>Date:</strong> {avail.date} <br />
                               {avail.time_slots.length > 0 ? (
                                avail.time_slots.map((slot, i) => (
                                  <div key={i}>
                                    {slot.start_time} - {slot.end_time} ({slot.status})
                                  </div>
                                ))
                              ) : (
                                <li>No available slots</li>
                              )}

                            </div>
                          ))
                        ) : (
                          <li>Not Available</li>
                        )}
                      </Col>

                      {/*Right section*/}
                      <Col md={2} className="text-end">
                      {/* Book Appointment button */}
                        <Button className="rounded-pill px-4" style={{ backgroundColor: "#A8577E", border: "none" }}>
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