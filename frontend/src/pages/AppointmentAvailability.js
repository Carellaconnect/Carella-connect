import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
import axios from 'axios';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



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

      <Container className="mt-4">
        <h4>
          {specialty && language ? `Find a ${specialty} speaking ${language} in Waterloo` : "Find a Doctor"}
        </h4>
        <Row>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Col md={12} key={doctor._id} className="mb-3">
                <Card className="shadow-sm p-3">
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h5>
                          <Link to="#" className="text-decoration-none text-primary">
                            {doctor.doctor_id.name}
                          </Link>
                        </h5>
                        <p className="text-muted">{doctor.speciality}</p>
                        <p><strong>Hospital:</strong> {doctor.doctor_id.hospital_id?.name || "N/A"}</p>
                      </Col>
                      <Col md={4} className="text-end">
                        <p><strong>Languages:</strong> {doctor.languages.map(lang => lang.language_name).join(", ")}</p>
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