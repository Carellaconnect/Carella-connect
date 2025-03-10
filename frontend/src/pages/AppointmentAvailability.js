import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const doctors = [
    {
      name: "Dr. John Doe",
      specialty: "Dentist",
      address: "50 University Ave East, N2J 2V8, Waterloo",
      nextAppointment: "17-03-2025"
    },
    {
      name: "Dr. Michael Brown",
      specialty: "Dentist",
      address: "108 University Avenue East, N2J 2V8, Waterloo",
      nextAppointment: "18-03-2025"
    }
  ];

const AppointmentAvailability = () => {
    return (
        <>
        {/* Navbar */}
              <Navbar expand="lg" className="px-4 py-3 m-0" style={{ backgroundColor: "#F7D9E1" }}>
                <Navbar.Brand href="#">
                  <img src="../images/Logo.png" alt="Logo" width="100" className="me-2" />
                  <strong style={{fontSize:"30px"}}>Carella Connect</strong> <span style={{fontSize:"12px"}}>Bridging the Gap in Healthcare!</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                </Navbar.Collapse>
              </Navbar>

              {/* Hero Section */}
                    <Container fluid className="hero-section d-flex align-items-center" style={{ height: "35vh", paddingTop: "0px", paddingBottom: "0px", margin: "0" }}>
                      <Row className="align-items-center w-100">
                        {/* Left Text */}
                        <Col md={6} className="text-start ps-5">
                          <h2>Book your next medical and health care appointment</h2>
                          <p>in a few clicks!</p>
                        </Col>
                        {/* Right Image */}
                        <Col md={6} className="p-0 text-end pe-5">
                          <img 
                            src="/images/apptbooking_image.png" 
                            alt="Patient Right" 
                            className="img-fluid w-75 hero-img"
                          />
                        </Col>
                      </Row>
                    </Container> 
              
                  {/* Search Section */}
                  <Container fluid className="mt-4" style={{ backgroundColor: "#F7D9E1", paddingTop: "0px"  }}>
                      <Row className="justify-content-center">
                        <Col md={8} className="d-flex gap-2 p-3 rounded" style={{ backgroundColor: "#F7D9E1"}}>
              
                        <Form.Select placeholder="Dentist" className="rounded-pill px-3" >
                            <option>Dentist</option>
                            <option>Dermatologist</option>
                        </Form.Select>
              
                          <Form.Control type="text" placeholder="Waterloo" className="rounded-pill px-3" />
              
                          <Form.Select className="rounded-pill px-3" placeholder="English">
                            <option>English</option>
                            <option>French</option>
                          </Form.Select>
                          <Button className="rounded-pill px-4" style={{ backgroundColor: "#A8577E", border: "none" }}>FIND</Button>
                        </Col>
                      </Row>
                    </Container>

                    <Container className="mt-4">
                        <h4>Find a Dentist speaking English in Waterloo</h4>
                        <Row>
                            {doctors.map((doctor, index) => (
                            <Col md={12} key={index} className="mb-3">
                            <Card className="shadow-sm p-3">
                            <Card.Body>
                            <Row>
                            <Col md={8}>
                            <h5>
                            <Link to="#" className="text-decoration-none text-primary">
                            {doctor.name}
                            </Link>
                            </h5>
                            <p className="text-muted">{doctor.specialty}</p>
                            <p>{doctor.address}</p>
                            </Col>
                            <Col md={4} className="text-end">
                            <p className="text-muted">Next appointment on:</p>
                            <Link to="#" className="text-decoration-none text-primary">
                      {doctor.nextAppointment}
                        </Link>
                        </Col>
                        </Row>
                    </Card.Body>
                    </Card>
                    </Col>
                    ))}
                    </Row>
                    </Container>
        
        </>
    );
};

export default AppointmentAvailability;