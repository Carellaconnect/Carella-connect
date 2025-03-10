import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Row, Col, Form } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const BookAppointment = () => {
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
      <Container fluid className="hero-section d-flex align-items-center" style={{ height: "50vh", objectFit: "cover" }}>
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
    <Container fluid className="mt-4" style={{ backgroundColor: "#F7D9E1", padding: "50px"  }}>
        <Row className="justify-content-center">
          <Col md={8} className="d-flex gap-2 p-3 rounded" style={{ backgroundColor: "#F7D9E1"}}>

          <Form.Select placeholder="Specialty or expertise" className="rounded-pill px-3" >
              <option>Dermatologist</option>
              <option>Dentist</option>
          </Form.Select>

            <Form.Control type="text" placeholder="Location" className="rounded-pill px-3" />

            <Form.Select className="rounded-pill px-3">
              <option>English</option>
              <option>French</option>
            </Form.Select>
            <Button className="rounded-pill px-4" style={{ backgroundColor: "#A8577E", border: "none" }}>FIND</Button>
          </Col>
        </Row>
      </Container>
             
   </>
  );
};

export default BookAppointment;

