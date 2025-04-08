import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Container, Button, Form, Card, Row, Col, Modal } from "react-bootstrap";
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
  const userData = JSON.parse(localStorage.getItem("user"));
  const [cancelSuccessMessage, setcancelSuccessMessage] = useState("");
  const [cancelFailureMessage, setcancelFailureMessage] = useState("");
  const [handleSearchMessage, sethandleSearchMessage] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);




  const handleSearch = () => {
    if (!specialty || !language) {
      sethandleSearchMessage("Please select both Specialty and Language.");
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

  // Function to cancel an appointment
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`http://localhost:5000/appointments/${appointmentId}`);

      // Remove the canceled appointment from state
      setAppointments(appointments.filter(appt => appt._id !== appointmentId));

      setcancelSuccessMessage("Appointment canceled successfully!");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      setcancelFailureMessage("Failed to cancel appointment. Please try again.");
    }
  };
  const handleFeedbackClick = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedRating(0);
    setComment("");
    setShowFeedbackModal(true);
  };
  const submitFeedback = async () => {
    if (selectedRating === 0 || comment.trim() === "") {
      alert("Please provide both a rating and a comment.");
      return;
    }
  
    try {
      await axios.post(`http://localhost:5000/appointments/${selectedAppointment._id}/feedback`, {
        rating: selectedRating,
        comment,
      });
  
      // Update past appointments locally to show new feedback without refetching
      const updatedPastAppointments = pastappointments.map((appt) =>
        appt._id === selectedAppointment._id
          ? { ...appt, feedback: { rating: selectedRating, comment } }
          : appt
      );
  
      setpastAppointments(updatedPastAppointments);
      setShowFeedbackModal(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };


  return (
    <>
      <Navigation />
      {/* Show success message if appointment is cancelled*/}
      {cancelSuccessMessage && (
        <div className="alert alert-success text-center" role="alert">
          {cancelSuccessMessage}
        </div>
      )}

      {/* Show handleSearch message*/}
      {handleSearchMessage && (
        <div className="alert alert-search-message text-center" role="alert" style={{ width: "100%", backgroundColor: "#e6c5be" }}>
          {handleSearchMessage}
        </div>
      )}

      {/* Show failure message if appointment is not cancelled */}
      {cancelFailureMessage && (
                <div className="alert alert-failure text-center" role="alert" style={{ width: "100%", backgroundColor: "#e6c5be" }}>
                    {cancelFailureMessage}
                </div>
            )}


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
                  <option value="Dentist">Dentist</option>
                  <option value="Orthopediac">Orthopediac</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="General Medicine">General Medicine</option>
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
                    <p><strong>Time:</strong> {new Date(new Date(appt.appointment_date).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString()}</p>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button className="me-2" style={{ backgroundColor: "#8D5B8F", border: "none" }}>Change</Button>
                    <Button style={{ backgroundColor: "#E32037", border: "none" }} onClick={() => handleCancelAppointment(appt._id)}>Cancel</Button>
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

                        {/* Feedback section */}
                        {pastappt.feedback ? (
                          <>
                           <p className="mb-1 mt-2"><strong>Your Feedback:</strong> &nbsp;&nbsp;
                    
                                {/* Stars */}
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} color={i < pastappt.feedback.rating ? "gold" : "lightgray"} /> 
                                ))} &nbsp;&nbsp;
                                {/* Feedback comment */}
                                <strong>Comment:</strong> {pastappt.feedback.comment}
                          
                           
                           </p>
                              
                          </>
                        ) : (
                          <Button style={{ backgroundColor: "#F4A5AE", border: "0px", color: "black"}}
                            onClick={() => handleFeedbackClick(pastappt)}>
                            Give Feedback
                          </Button>
                        )}
                      </Col>

                      <Col md={3}>
                        <p><strong>Date:</strong> {new Date(pastappt.appointment_date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {new Date(new Date(pastappt.appointment_date).getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString()}</p>
                      </Col>

                      <Col md={3} className="text-end">
                        <Button className="me-2 mb-2" style={{ backgroundColor: "#A8577E", border: "none" }}
                          onClick={() => navigate(`/consultation-records?appointmentId=${pastappt._id}&doctorName=${encodeURIComponent(pastappt.doctor_name)}&hospitalName=${encodeURIComponent(pastappt.hospital_name)}`)}>
                          View Records
                        </Button>

                        <Button className="me-2 mb-2" style={{ backgroundColor: "#8D5B8F", border: "none" }}
                          onClick={() => navigate(`/followup-appointment?doctorId=${pastappt.doctorid}&doctorName=${encodeURIComponent(pastappt.doctor_name)}`)}>
                          Book Follow-up
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <p>No completed consultations.</p>
              )
            )}
          </Container>
      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Give Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={i < selectedRating ? "gold" : "lightgray"}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedRating(i + 1)}
              />
            ))}
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            Close
          </Button>
          <Button style={{ backgroundColor: "#A8577E", border: "none" }} onClick={submitFeedback}>
            Submit Feedback
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default Patient;