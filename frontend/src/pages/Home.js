// src/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Row, Col, Card } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const services = [
  {
    name: "Online Appointments",
    description: "Easily search for doctors and hospitals and schedule appointments in just a few clicks.",
    img: "/images/online.jpg"
  },
  {
    name: "Virtual Consultations",
    description: "Connect with healthcare professionals through secure online video consultations.",
    img: "/images/virtual.jpg"
  },
  {
    name: "Medical Records Access",
    description: "View and manage your medical history with secure, read-only access.",
    img: "/images/medical.jpg"
  },
  {
    name: "Prescription Management",
    description: "Order medicines online and receive reminders for prescriptions and refills.",
    img: "/images/medication.jpg"
  },
  {
    name: "Emergency Assistance",
    description: "Quickly contact emergency services or locate the nearest hospital when needed.",
    img: "/images/emergency.jpg"
  },
  {
    name: "Health Education & Resources",
    description: "Access expert-reviewed articles, videos, and wellness tips for a healthier life.",
    img: "/images/education.jpg"
  }
];

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
              <Button style={{backgroundColor:"#F4A5AE", border:"0px",color:"black"}} className="me-2">SignUp</Button>
            </Link>
            <Link to="/login">
              <Button style={{backgroundColor:"#A8577E", border:"0px"}}>Login</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <Container fluid className="hero-section" style={{ height: "55vh", objectFit: "cover" }} >
      <Row className="align-items-center">
        {/* Left Image */}
        <Col md={4} className="p-0">
          <img 
            src="/images/drhand.png" 
            alt="Doctor Left" 
            className="img-fluid w-100 hero-img"
          />
        </Col>

        {/* Center Text */}
        <Col md={4} className="text-center py-5">
          <h2>Carella Connect – Bridging the Gap in Healthcare!</h2>
          <p>
            Bringing quality healthcare closer to you.  
            Find doctors, access medical records, and receive medication alerts.
          </p>
          <Link to="/login">
            <Button style={{ backgroundColor: "#A8577E", border: "none", padding: "10px 20px", fontSize: "1.2rem" }}>
              Book Now
            </Button>
          </Link>
        </Col>

        {/* Right Image */}
        <Col md={4} className="p-0">
          <img 
            src="/images/pthand.png" 
            alt="Patient Right" 
            className="img-fluid w-100 hero-img"
          />
        </Col>
      </Row>
    </Container>

      {/* Services */}
      
      <Container className="my-5 text-center p-5 pt-3 pb-3" style={{ borderRadius: "15px", boxShadow: "2px 2px 5px 3px #bcbcbc" }}>
      <h3 className='mt-0 pt-0 pb-3'>Services</h3>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={3}  // Show 3 cards at a time
        navigation
        pagination={{ clickable: true}}
        breakpoints={{
          320: { slidesPerView: 1 }, // For mobile
          768: { slidesPerView: 2 }, // For tablets
          1024: { slidesPerView: 3 } // For larger screens
        }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <Card className="shadow-sm mb-5">
              <Card.Img variant="top" src={service.img} />
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Button style={{ backgroundColor: "#A8577E", border: "0px" }}>Learn More</Button>
              </Card.Body>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>

      {/* How It Works */}
      <Container className="text-center my-5">
        <h3>How It Works</h3>
        <Row>
        {[{ id: 1, title: "Book an Appointment", text: "No more waiting for hours in a walk-in clinic or weeks to see your family doctor. Doctors on your schedule, book online.", button:"Book Now" },
          { id: 2, title: "Consult a Doctor", text: "Speak directly with doctors in Canada by phone, video, or secure messaging, on any device. You’re in control and your time is valuable.", button:"Available Doctors" },
          { id: 3, title: "Safe and Sound", text: "Receive referrals, requisitions and any other documents you need, all online. Free prescription delivery in Canada.",button:"Get Started" }]
          .map((step) => (
            <Col key={step.id} className="m-4 p-4" style={{borderRadius:"160px",boxShadow:"2px 2px 5px 3px #bcbcbc", width:"600px"}}>
              <p className="badge p-3" style={{backgroundColor:"#A8577E", borderRadius:"95%", fontSize:"15px"}}>{step.id}</p>
              <h5 className='mt-3'>{step.title}</h5>
              <p>{step.text}</p>
              <Button className='mt-3 p-2' style={{backgroundColor:"#A8577E", border:"0px"}}>{step.button}</Button>
            </Col>
          ))}
          </Row>
      </Container>

      {/* Features */}
      <Container fluid className="my-5 p-4 text-center" style={{ backgroundColor: "#F7D9E1"}}>
        <h3>Features</h3>
        <Row className="mt-3">
          {[{ title: "Search and Book Appointments", icon: "🔍", detail:"Find doctors/hospitals and schedule consultations" },
            { title: "Medical Record Access", icon: "📄", detail:"View past prescriptions, diagnoses, and reports (read-only)"  },
            { title: "Virtual Health Resources", icon: "📚", detail:"Educational content on common health concerns and self-care"},
            { title: "Notifications & Alerts", icon: "🔔", detail:"Reminders for upcoming appointments and medication schedules"  },
            { title: "Emergency Services Request", icon: "🚑", detail:"Quick access to emergency contacts and assistance"  },
            { title: "Medication Delivery or Pickup", icon: "💊", detail:"Option to receive prescribed medicines at home or pick them up"  }]
            .map((feature, index) => (
              <Col md={4} key={index} className="d-flex align-items-center">
                <h1 className='m-2 mb-3'>{feature.icon}</h1>
                <div className='text-start'>
                  <h5>{feature.title}</h5>
                  <p>{feature.detail}</p>
                </div>                
              </Col>
            ))}
        </Row>
      </Container>

   </>
  );
};

export default Home;
