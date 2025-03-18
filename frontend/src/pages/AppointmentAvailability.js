import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { Navbar, Nav, Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
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
       <Navigation />
        <Nav className="ms-auto">
         
          <Nav.Link href="/Home" className='text-dark'>Home</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="#" className='text-dark'>Profile</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="#" className='text-dark'>Help & Support</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          <Nav.Link href="/Home" className='text-dark' >Log Out</Nav.Link>
          <span style={{border:"1px solid #a6a6a6"}}></span>
          
          <FaBell size={20} className="mt-2" style={{color:"#A8577E", marginLeft:"1050px"}} />
          
        </Nav>

                         {/* Search Section */}
                               <Container fluid className="text-center p-5" style={{ backgroundColor: "#d7d7d7" }}>
                           <Row className="justify-content-center">
                             <Col md={8} className="text-center">
                               {/* Title */}
                               <h3 className="fw-bold">Find Your Doctor</h3>
                               {/* Subtitle */}
                               <p>Book an appointment for consultation</p>
                               {/* Search Fields */}
                               <Row className="justify-content-center mt-3">
                                 <Col md={3}>
                                   <Form.Select className="rounded-pill px-3">
                                     <option>Dermatologist</option>
                                     <option>Dentist</option>
                                   </Form.Select>
                                 </Col>
                                 <Col md={3}>
                                   <Form.Control type="text" placeholder="Location" className="rounded-pill px-3" />
                                 </Col>
                                 <Col md={3}>
                                   <Form.Select className="rounded-pill px-3">
                                     <option>English</option>
                                     <option>French</option>
                                   </Form.Select>
                                 </Col>
                                 <Col md={2}>
                                   <Button className="rounded-pill px-4" style={{ backgroundColor: "#A8577E", border: "none" }}>
                                     FIND
                                   </Button>
                                 </Col>
                               </Row>
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