import React from 'react';
import Navigation from './Navigation';
import { Container, Nav, Button, Form, Card } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";
const doctors = [
  { name: "Dr. Doctor Name1", specialty: "Specialty", feedback: 4 },
  { name: "Dr. Doctor Name2", specialty: "Specialty", feedback: 3 },
];

const Patient = () => {
  return <>
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
      <Container fluid className="text-center p-5" style={{backgroundColor:"#d7d7d7"}} >
        <h3>Find Your Doctor</h3>
        <p>Book an appointment for consultation</p>
        <Form className="d-flex justify-content-center">
          <Form.Control type="search" placeholder="Search doctors..." className="w-50" />
          <Button className="ms-2" style={{backgroundColor:"#A8577E", border:"0px"}}>
            <FaSearch />
          </Button>
        </Form>
      </Container>

      {/* Completed Consultations */}
      <Container className="mt-5 text-start">
        <h4 >Completed Consultations</h4>
        {doctors.map((doctor, index) => (
          <Card key={index} className="mb-3 p-3">
            <Card.Body className="d-flex justify-content-between">
              <div>
              <h5>{doctor.name}</h5>
              <p>{doctor.specialty}</p>
              </div>
              <div>
              <p>
                <strong>Date & Time:</strong> [Insert Date] - Patient Name
              </p>
              <p>
                <strong>Symptoms:</strong> Fever, Headache...
              </p>
              </div>
              <div>
                <div className='mb-4 text-center'>
                <strong>Your Feedback:</strong>{" "}
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} color={i < doctor.feedback ? "gold" : "gray"} />
                  ))}
                </div>
                <div>
                  <Button className="me-2" style={{backgroundColor:"#F4A5AE", border:"0px", color:"Black"}}>View Records</Button>
                  <Button style={{backgroundColor:"#A8577E", border:"0px"}}>Book Follow-up</Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
  </>
};

export default Patient;
