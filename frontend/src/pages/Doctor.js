import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FaBell,FaSearch } from "react-icons/fa";
import { Container, Nav, Row, Col, Table, Card, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Doctor = ({ onSelectPatient }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
 
    useEffect(() => {
      const fetchAppointments = async () => {
        try {
          const userData = JSON.parse(localStorage.getItem("user"));
    
          if (!userData || !userData.id) {
            setError("User not found. Please log in again.");
            setLoading(false);
            return;
          }
    
          const response = await axios.get(
            `http://localhost:5000/api/upcoming-appointments/${userData.id}`
          );
    
          if (response.data.message) {
            // If there is an error message from the backend (e.g., doctor not found)
            setError(response.data.message);  // Show error message
            setAppointments([]);
          } else {
            setAppointments(response.data.data);  // Otherwise, show the appointments
          }
    
        } catch (err) {
          setError("Failed to fetch appointments.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchAppointments();
    }, []);
    
    
  

  const handleSelect = (appt) => {
    setSelectedAppointment(appt);
  };
  const handleView = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDiscard = (appointmentId) => {
    axios.put(`http://localhost:5000/api/appointments/cancel/${appointmentId}`)
      .then(() => {
        setAppointments(appointments.filter(appt => appt._id !== appointmentId));
        alert("Appointment cancelled successfully.");
      })
      .catch(error => console.error("Error cancelling appointment:", error));
  };
  return <>
  <Navigation />
    
    <Container fluid className="p-4">
        <Row>
          {/* Appointments Section */}
          <Col md={6} className='h-50'>
          <Card className="mb-4 p-3 shadow-sm">
              <h5>Upcoming Appointments</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt._id}>
                      <td>
                        <Form.Check
                          type="radio"
                          name="selectedAppointment"
                          onChange={() => handleSelect(appt)}
                          checked={selectedAppointment?._id === appt._id}
                        />
                      </td>
                      <td>{appt.patient_id.name}</td>
                      <td>{moment(appt.appointment_date).format("DD MMM YYYY")}</td>
                      <td>{moment(appt.appointment_date).format("HH:mm")}</td>
                      <td>
                        <Button style={{backgroundColor:"#A8577E", border:"0px"} } onClick={handleView}>View</Button>
                        <Button style={{ backgroundColor: "#F4A5AE", border: "0px", color: "black" }} onClick={() => handleDiscard(appt._id)}>Discard</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
                 {/* Modal for Viewing Appointment Details */}
                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedAppointment ? (
                      <>
                        <h5>Patient Name: {selectedAppointment.patient_id.name}</h5>
                        <p>Patient Email: {selectedAppointment.patient_id.email}</p>
                        <p>Patient Phone No: {selectedAppointment.patient_id.phone}:</p>
                        <p>Patient Gender: {selectedAppointment.patient_id.gender}</p>
                        <p>Reason : {selectedAppointment.reason}</p>
                        <p>Date: {moment(selectedAppointment.appointment_date).format("DD MMM YYYY")}</p>
                        <p>Time: {moment(selectedAppointment.appointment_date).format("HH:mm")}</p>
                        <p>Status: {selectedAppointment.status}</p>
                        
                        {/* Add more details as necessary */}
                      </>
                    ) : (
                      <p>No appointment selected</p>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
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
