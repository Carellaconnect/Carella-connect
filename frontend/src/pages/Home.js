// src/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Row, Col, Card } from "react-bootstrap";
const Home = () => {
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
          <Nav>
            <Link to="/signup">
              <Button variant="outline-dark" className="me-2">SignUp</Button>
            </Link>
            <Link to="/login">
              <Button variant="dark">Login</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <Container className="mt-4 text-center">
        <Row className="align-items-center">
          <Col md={6}>
            <img src="../images/doc.jpg" alt="Doctor" className="img-fluid rounded" />
          </Col>
          <Col md={6} className="text-md-start">
            <h2>Carella Connect – Bridging the Gap in Healthcare!</h2>
            <p>
              Carella Connect brings quality healthcare closer to you, no matter where you are.
              Find and consult doctors, access medical records, and receive medication alerts.
            </p>
            <Link to="/login">
              <Button variant="primary">Book Now</Button>
            </Link>
          </Col>
        </Row>
      </Container>

      {/* Services */}
      <Container className="my-5 text-center">
          <h3>Services</h3>
          <Row className="mt-3">
            {[
              {
                name: "Online Appoinments",
                description: "Easily search for doctors and hospitals and schedule appointments in just a few clicks.",
                img: "https://via.placeholder.com/150/0000FF/808080?text=Pharma"
              },
              {
                name: "Virtual Consultations",
                description: "Connect with healthcare professionals through secure online video consultations.",
                img: "https://via.placeholder.com/150/008000/FFFFFF?text=Lab+Services"
              },
              {
                name: "Medical Records Access",
                description: "View and manage your medical history with secure, read-only access.",
                img: "https://via.placeholder.com/150/FFA500/FFFFFF?text=Nutrition"
              },
              {
                name: "Medication & Prescription Management",
                description: "Order medicines online and receive reminders for prescriptions and refills.",
                img: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Check-ups"
              },
              {
                name: "Emergency Assistance",
                description: "Quickly contact emergency services or locate the nearest hospital when needed.",
                img: "https://via.placeholder.com/150/800080/FFFFFF?text=Physio"
              },
              {
                name: "Health Education & Resources",
                description: "Access expert-reviewed articles, videos, and wellness tips for a healthier life.",
                img: "https://via.placeholder.com/150/800080/FFFFFF?text=Physio"
              }
            ].map((service, index) => (
              <Col md={4} lg={2} key={index} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Img variant="top" src={service.img} />
                  <Card.Body>
                    <Card.Title>{service.name}</Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                    <Button variant="primary">Learn More</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

      {/* How It Works */}
      <Container className="text-center my-5">
        <h3>How It Works</h3>
        {[{ id: 1, title: "Book an Appointment", text: "No more waiting in walk-in clinics." },
          { id: 2, title: "Consult a Doctor", text: "Speak directly with doctors." },
          { id: 3, title: "Safe and Sound", text: "Receive referrals and prescriptions online." }]
          .map((step) => (
            <div key={step.id} className="my-4">
              <span className="badge bg-primary p-2">{step.id}</span>
              <h5>{step.title}</h5>
              <p>{step.text}</p>
              <Button variant="primary">Get Started</Button>
            </div>
          ))}
      </Container>

      {/* Features */}
      <Container className="my-5 p-4 text-center" style={{ backgroundColor: "#F7D9E1" }}>
        <h3>Features</h3>
        <Row className="mt-3">
          {[{ title: "Search and Book Appointments", icon: "🔍" },
            { title: "Medical Record Access", icon: "📄" },
            { title: "Virtual Health Resources", icon: "📚" },
            { title: "Notifications & Alerts", icon: "🔔" },
            { title: "Emergency Services Request", icon: "🚑" },
            { title: "Medication Delivery or Pickup", icon: "💊" }]
            .map((feature, index) => (
              <Col md={4} key={index} className="mb-3">
                <h5>{feature.icon} {feature.title}</h5>
              </Col>
            ))}
        </Row>
      </Container>

   </>
  );
};

export default Home;
