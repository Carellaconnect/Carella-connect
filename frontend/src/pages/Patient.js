import React, { useState, useEffectuseState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Container, Button, Form, Card, Row, Col } from "react-bootstrap";
import { FaStar, FaBell } from "react-icons/fa";
import axios from "axios";


const Patient = () => {
  const navigate = useNavigate(); // Initialize useNavigate


  // State for dropdown selections
  const [specialty, setSpecialty] = useState('');
  const [language, setLanguage] = useState('');
  
  const [appointments, setAppointments] = useState([]);
  const [pastappointments, setpastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const handleSearch = () => {
    if (!specialty || !language) {
      alert("Please select both Specialty and Language.");
      return;
    }

    // Navigate to the AppointmentAvailability page with selected values as URL parameters
    navigate(`/appointment-availability?specialty=${encodeURIComponent(specialty)}&language=${encodeURIComponent(language)}`);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user')); // Get logged-in user
        if (!userData || !userData.id) {
          setError('User not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/patient-dashboard/${userData.id}`);
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointments.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchPastAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.id) {
          setError('User not found. Please log in again.');
          return;
        }
        const response = await axios.get(`http://localhost:5000/patient-dashboard/${userData.id}/past-appointments`);
        setpastAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch past appointments.');
      }
    };
  
    fetchPastAppointments();
  }, []);

  return(
    <>
    <Navigation />
          {/* Menu section */}
    

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
        <Form.Select
                  className="rounded-pill px-3"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}>
                  <option value="">Select Specialty</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Dentist">Dentist</option>
        </Form.Select>
        </Col>
        
        <Col md={3}>
        <Form.Select
                  className="rounded-pill px-3"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}>
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="French">French</option>
                </Form.Select>
        </Col>
        <Col md={2}>
        {/* Search Button */}
        <Button className="rounded-pill px-4" style={{ backgroundColor: "#A8577E", border: "none" }} onClick={handleSearch}>
            FIND
          </Button>
        </Col>
      </Row>
    </Col>
  </Row>
</Container>


{/* Upcoming Consultations */}
<Container className="mt-5 text-start">
        <h2>Upcoming Consultations</h2>
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
          appointments.length > 0 ? (
            appointments.map((appt) => (
              <Card className="p-3 mb-3 shadow-sm" key={appt._id}>
                <Row>
                  <Col md={6}>
                    <h5><strong>Dr. {appt.doctor_name}</strong></h5>
                    <p><strong>Hospital:</strong> {appt.hospital_name}</p>
                  </Col>
                  <Col md={3}>
                    <p><strong>Date:</strong> {new Date(appt.appointment_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(appt.appointment_date).toLocaleTimeString()}</p>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button className="me-2" style={{ backgroundColor: "#8D5B8F", border: "none" }}>Change</Button>
                    <Button style={{ backgroundColor: "#E32037", border: "none" }}>Cancel</Button>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <p>No upcoming consultations.</p>
          )
        )}
      </Container>



  {/* Completed Consultations */}
  <Container className="mt-5 text-start">
        <h2>Completed Consultations</h2>
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
          pastappointments.length > 0 ? (
            pastappointments.map((pastappt) => (
              <Card className="p-3 mb-3 shadow-sm" key={pastappt._id}>
                <Row>
                  <Col md={6}>
                    <h5><strong>Dr. {pastappt.doctor_name}</strong></h5>
                    <p><strong>Hospital:</strong> {pastappt.hospital_name}</p>
                  </Col>
                  <Col md={3}>
                    <p><strong>Date:</strong> {new Date(pastappt.appointment_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(pastappt.appointment_date).toLocaleTimeString()}</p>
                  </Col>
                  <Col md={3} className="text-end">
                    <p className="mb-1"><strong>Your Feedback:</strong> 
                      <FaStar color="gold" /> <FaStar color="gold" /> <FaStar color="gold" /> <FaStar color="gold" /> <FaStar color="lightgray" />
                    </p>
                    <Button className="me-2" style={{ backgroundColor: "#F28D8D", border: "none" }}>View Records</Button>
                    <Button style={{ backgroundColor: "#8D5B8F", border: "none" }}>Book Follow-up</Button>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <p>No past consultations.</p>
          )
        )}
      </Container>
</>
  )
};



export default Patient;