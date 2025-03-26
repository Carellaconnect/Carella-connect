import React, { useState } from 'react';
import Navigation from './Navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FaBell,FaSearch } from "react-icons/fa";
import { Container, Nav, Row, Col, Card, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Doctor = () => {

  //Logout fucntionality
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    window.location.href = "/login"; // Redirect to login page
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  return <>
  <Navigation />
      <Nav className="ms-auto" style={{borderBottom:" 2px solid #d7d7d7"}}>
        <Nav.Link href="/Home" className='text-dark'>Home</Nav.Link>
        <span style={{border:"1px solid #a6a6a6"}}></span>
        <Nav.Link href="#" className='text-dark'>Profile</Nav.Link>
        <span style={{border:"1px solid #a6a6a6"}}></span>
        <Nav.Link href="#" className='text-dark'>Help & Support</Nav.Link>
        <span style={{border:"1px solid #a6a6a6"}}></span>
        <Nav.Link href="/Home" className='text-dark' onClick={handleLogout} >Log Out</Nav.Link>
        <span style={{border:"1px solid #a6a6a6"}}></span>
        <FaBell size={20} className="mt-2" style={{color:"#A8577E", marginLeft:"1050px"}} />
      </Nav>
    
    <Container fluid className="p-4">
        <Row>
          {/* Appointments Section */}
          <Col md={6} className='h-50'>
            <Card className="mb-4 p-3 shadow-sm h-95">
              <h5>Appointments</h5>
              {["Patient Name1", "Patient Name2", "Patient Name3"].map((patient, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center my-2">
                  <span>{patient} - Condition - Date & Time</span>
                  <div>
                    <Button style={{backgroundColor:"#A8577E", border:"0px"}} className="me-2">Accept</Button>
                    <Button variant="secondary">Cancel</Button>
                  </div>
                </div>
              ))}
            </Card>
          </Col>

          {/* Medical Records Section */}
          <Col md={6}>
            <Card className="mb-4 p-3 shadow-sm h-95">
              <h5>Medical Records</h5>
              <Form className="d-flex justify-content-center mb-3 mt-3">
                        <Form.Control type="search" placeholder="Search doctors..." className="w-100" />
                        <Button className="ms-2" style={{backgroundColor:"#A8577E", border:"0px"}}>
                          <FaSearch />
                        </Button>
                      </Form>
              {["Patient Name1", "Patient Name2"].map((patient, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center my-2">
                  <span>{patient} - Condition - Date & Time</span>
                  <Button style={{backgroundColor:"#A8577E", border:"0px"}}>View</Button>
                </div>
              ))}
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Prescription Section */}
          <Col md={6}>
            <Card className="mb-4 p-3 shadow-sm h-100">
              <h5>Prescription</h5>
              <Form className="d-flex justify-content-center mb-3 mt-3">
                        <Form.Control type="search" placeholder="Search medications..." className="w-100" />
                        <Button className="ms-2" style={{backgroundColor:"#A8577E", border:"0px"}}>
                          <FaSearch />
                        </Button>
                      </Form>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Acetaminophen - pain, cold, flu... - age 12+</span>
                <Button style={{backgroundColor:"#A8577E", border:"0px"}}>Add to Prescription</Button>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Acetaminophen - pain, cold, flu... - age 12+</span>
                <Button style={{backgroundColor:"#A8577E", border:"0px"}}>Add to Prescription</Button>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Acetaminophen - pain, cold, flu... - age 12+</span>
                <Button style={{backgroundColor:"#A8577E", border:"0px"}}>Add to Prescription</Button>
              </div>
            </Card>
          </Col>

          {/* Availability Section */}
          <Col md={6}>
            <Card className="mb-4 p-3 shadow-sm h-100">
              <h5>Availability</h5>
              <div className='d-flex justify-content-between mt-3'>
              <div className="m-5 mb-0 mt-0">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    inline
                  />
                </div>
                <div className='me-5'>
                <p><strong>Selected Date:</strong> {moment(selectedDate).format("DD MMM YYYY")}</p>
                  <div >
                    <Form.Group>
                      <Form.Label>From:</Form.Label>
                      <Form.Control className='w-100' type="text" value="8 AM" readOnly />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>To:</Form.Label>
                      <Form.Control className='w-100' type="text" value="8 PM" readOnly />
                    </Form.Group>
                  </div>
                  <div className="mt-3">
                    <Button variant="secondary" className="me-2">Edit</Button>
                    <Button style={{backgroundColor:"#A8577E", border:"0px"}}>Save</Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
  </>
};

export default Doctor;
