import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Calendar from 'react-calendar';
import moment from "moment";
import { FaBell, FaSearch } from "react-icons/fa";
import { Container, Nav, Row, Col, Table, Card, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import './doctor.css';



const Doctor = ({ onSelectPatient }) => {
  const doctor = JSON.parse(localStorage.getItem("user"));
  const doctorId = doctor.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMedicalRecordModal, setShowMedicalRecordModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState('');
  const [allergies, setAllergies] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [newSlot, setNewSlot] = useState({ start_time: '', end_time: '', status: 'available' });
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState([]);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData || !userData.id) {
          setError("User not found. Please log in again.");
          setLoading(false);
          return;
        } else {
          setUserData(userData);
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

  const handleView = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowMedicalRecordModal(false);
  };

  const handleMedicalRecordView = async (recordId) => {
    const response = await axios.get(
      `http://localhost:5000/api/getMedicalRecordById/${recordId}`
    );
    if(response && response.data && response.data.data && response.data.data[0]){
      setSelectedMedicalRecord(response.data.data[0]);
    }
    setShowMedicalRecordModal(true);
  }

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

  const handlePatientRecordModalClose = () => {
    setShowUserEditModal(false);
  };

  const updateMedicalRecord = async () => {
    try {
      const formData = {
        appointmentId: selectedAppointment._id,
        email: selectedAppointment.patient_id.email,
        patientName: selectedAppointment.patient_id.name,
        patientId: selectedAppointment.patient_id._id,
        reason: selectedAppointment.reason,
        allergies,
        diagnosis,
        medication,
        appointmentDate: selectedAppointment.appointment_date
      };
      let formErrors = {};
      try {
        const response = await axios.post("http://localhost:5000/updateAppointment", formData);
        console.log(response.data);
      } catch (error) {
        console.log('Inside catch');
      }
    } catch (error) {

    }
    setShowUserEditModal(false);
  };

  const completeConsultation = async () => {
    try {
      const formData = {
        appointmentId: selectedAppointment._id,
        email: selectedAppointment.patient_id.email,
        patientName: selectedAppointment.patient_id.name,
        patientId: selectedAppointment.patient_id._id,
        reason: selectedAppointment.reason,
        allergies,
        diagnosis,
        medication,
        appointmentDate: selectedAppointment.appointment_date
      };
      let formErrors = {};
      try {
        const response = await axios.post('http://localhost:5000/completeConsultation', formData);
        console.log(response.data);
        window.location.reload();
      } catch (error) {
        console.log('Inside catch');
      }
    } catch (error) {

    }
    setShowUserEditModal(false);
  };

  const handleSelect = async (appt) => {
    console.log(appt);
    setSelectedAppointment(appt);
    const response = await axios.get(
      `http://localhost:5000/api/getAllPreviousRecords/${appt.patient_id._id}`
    );
    if(response && response.data && response.data.data){
      setMedicalRecords(response.data.data);
    }
  };

  ///api/getAllPreviousRecords/:patientId
  const handleAppointment = async () => {
    if (selectedAppointment) {
      const response = await axios.get(
        `http://localhost:5000/api/fetchMedicalRecords/${selectedAppointment._id}`
      );
      console.log(response);
      if (response && response.data && response.data.data && response.data.data[0]) {
        setAllergies(response.data.data[0].allergies);
        setDiagnosis(response.data.data[0].diagnosis);
        setMedication(response.data.data[0].medication);
      }
    }
    setShowUserEditModal(true);
  };


  // Fetch availability when the page loads
  useEffect(() => {
    fetchAvailability(selectedDate);
  }, [selectedDate]);

  const fetchAvailability = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await axios.get(`/doctor/availability/${doctorId}`);
      const doctorAvailability = response.data;

      const dayAvailability = doctorAvailability.find(
        (availability) => new Date(availability.date).toISOString().split('T')[0] === formattedDate
      );

      setAvailableTimeSlots(dayAvailability ? dayAvailability.time_slots : []);
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const handleAddTimeSlot = async () => {
    if (!newSlot.start_time || !newSlot.end_time) {
      alert('Please enter both start and end time.');
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const newTimeSlot = {
        start_time: new Date(`${formattedDate}T${newSlot.start_time}`).toISOString(),
        end_time: new Date(`${formattedDate}T${newSlot.end_time}`).toISOString(),
        status: newSlot.status
      };

      await axios.post(`/doctor/add-time-slot/${doctorId}`, {
        date: formattedDate,
        time_slot: newTimeSlot
      });

      setAvailableTimeSlots([...availableTimeSlots, newTimeSlot]); // Update UI dynamically
      setNewSlot({ start_time: '', end_time: '', status: 'available' }); // Reset form
    } catch (err) {
      console.error('Error adding time slot:', err);
    }
  };
  const handleEditTimeSlot = (index) => {
    setEditingSlot(index);
    setNewSlot({ ...availableTimeSlots[index] });
  };

  const handleUpdateTimeSlot = async () => {
    if (!newSlot.start_time || !newSlot.end_time) {
      alert('Please enter both start and end time.');
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const updatedTimeSlot = {
        start_time: new Date(`${formattedDate}T${newSlot.start_time}`).toISOString(),
        end_time: new Date(`${formattedDate}T${newSlot.end_time}`).toISOString(),
        status: newSlot.status
      };

      await axios.put(`/doctor/update-time-slot/${doctorId}`, {
        date: formattedDate,
        index: editingSlot,
        time_slot: updatedTimeSlot
      });

      const updatedSlots = [...availableTimeSlots];
      updatedSlots[editingSlot] = updatedTimeSlot;
      setAvailableTimeSlots(updatedSlots);
      setEditingSlot(null);
      setNewSlot({ start_time: '', end_time: '', status: 'available' });
    } catch (err) {
      console.error('Error updating time slot:', err);
    }
  };

  const handleDeleteTimeSlot = async (index) => {
    try {
      await axios.delete(`/doctor/delete-time-slot/${doctorId}`, {
        data: { date: selectedDate.toISOString().split('T')[0], index }
      });

      const updatedSlots = availableTimeSlots.filter((_, i) => i !== index);
      setAvailableTimeSlots(updatedSlots);
    } catch (err) {
      console.error('Error deleting time slot:', err);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const availableDay = availability.find((avail) => moment(avail.date).format('YYYY-MM-DD') === formattedDate);
    setTimeSlots(availableDay ? availableDay.time_slots : []);
  };


  return <>
    <Navigation />

    <Container fluid className="p-4">
      <Row>
        {/* Appointments Section */}
        <Col md={6} className='h-50' >
          <Card className="mb-4 p-3 shadow-sm" style={{height:"250px"}}>
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
                      <Button style={{ backgroundColor: "#A8577E", border: "0px", marginRight:"10px"}} onClick={handleView}>View</Button>
                      <Button style={{ backgroundColor: "#F4A5AE", border: "0px", color: "black", marginRight:"10px"}} onClick={() => handleDiscard(appt._id)}>Discard</Button>
                      <Button style={{ backgroundColor: "#A8577E", border: "0px", color: "white"}} onClick={() => handleAppointment(appt._id)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Modal for editing the patient record by doctor */}
            <Modal show={showUserEditModal} onHide={handlePatientRecordModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Patient Record</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedAppointment ? (
                  <>
                    <Row>
                      <Col>
                        <h5>Patient Name: {selectedAppointment.patient_id.name}</h5>
                      </Col>
                      <Col>
                        <p>Patient Email: {selectedAppointment.patient_id.email}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Patient Phone No: {selectedAppointment.patient_id.phone}:</p>
                      </Col>
                      <Col>
                        <p>Patient Gender: {selectedAppointment.patient_id.gender}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Date: {moment(selectedAppointment.appointment_date).format("DD MMM YYYY")}</p>
                      </Col>
                      <Col>
                        <p>Time: {moment(selectedAppointment.appointment_date).format("HH:mm")}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Reason : {selectedAppointment.reason}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h4>Allergies</h4>
                        <textarea
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          placeholder="Enter here if patient has any allergies."
                          rows="4"
                          cols="50"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h4>Diagnosis</h4>
                        <textarea
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="Enter the diagnosis."
                          rows="4"
                          cols="50"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h4>Medication</h4>
                        <textarea
                          value={medication}
                          onChange={(e) => setMedication(e.target.value)}
                          placeholder="Enter the medication."
                          rows="4"
                          cols="50"
                        />
                      </Col>
                    </Row>
                    {/* Add more details as necessary */}
                  </>
                ) : (
                  <p>No appointment selected</p>
                )}
              </Modal.Body>
              {selectedAppointment ? (
                <>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={updateMedicalRecord}>
                      Update
                    </Button>
                    <Button variant="secondary" onClick={completeConsultation}>
                      Complete Consultation
                    </Button>
                  </Modal.Footer>
                </>
              ) : (
                <p></p>
              )}
            </Modal>

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
        {/* <Col md={6}>
          <Card className="mb-4 p-3 shadow-sm h-95" style={{height:"250px"}}>
            <h5>Medical Records</h5>
            <Form className="d-flex justify-content-center mb-3 mt-3">
              <Form.Control type="search" placeholder="Search doctors..." className="w-100" />
              <Button className="ms-2" style={{ backgroundColor: "#A8577E", border: "0px" }}>
                <FaSearch />
              </Button>
            </Form>
            {["Patient Name1", "Patient Name2"].map((patient, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center my-2">
                <span>{patient} - Condition - Date & Time</span>
                <Button style={{ backgroundColor: "#A8577E", border: "0px" }}>View</Button>
              </div>
            ))}
          </Card>
        </Col> */}
        <Col>
        <Card className="mb-4 p-3 shadow-sm h-95" style={{height:"250px"}}>
          <h5>Previous Medical Records</h5>
          {selectedAppointment ? (
            <>
              <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map(record => (
                  <tr key={record._id}>
                    <td>{record.patientName}</td>
                    <td>{record.reason}</td>
                    <td>{moment(record.appointment_date).format("DD MMM YYYY")}</td>
                    <td>
                      <Button style={{ backgroundColor: "#A8577E", border: "0px"}} onClick={() => handleMedicalRecordView(record._id)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            </>
          ) : (
            <p>No appointment selected</p>
          )}
          <Modal show={showMedicalRecordModal} onHide={handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Appointment Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedMedicalRecord ? (
                  <>
                    <h5>Patient Name: {selectedMedicalRecord.patientName}</h5>
                    <p>Patient Email: {selectedMedicalRecord.email}</p>
                    <p>Reason : {selectedMedicalRecord.reason}</p>
                    <p>Date: {moment(selectedMedicalRecord.appointment_date).format("DD MMM YYYY")}</p>
                    <p>Allergies: {selectedMedicalRecord.allergies}</p>
                    <p>Diagnosis: {selectedMedicalRecord.diagnosis}</p>
                    <p>Medication: {selectedMedicalRecord.medication}</p>

                    {/* Add more details as necessary */}
                  </>
                ) : (
                  <p>No record to show</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
        </Card>
        </Col>
      </Row>

      <Row className="mb-4 p-3 shadow-sm" style={{height:"500px"}}>
        {/* Prescription Section */}
        {/* <Col md={6}>
          <Card className="mb-4 p-3 shadow-sm h-100">
            <h5>Prescription</h5>
            <Form className="d-flex justify-content-center mb-3 mt-3">
              <Form.Control type="search" placeholder="Search medications..." className="w-100" />
              <Button className="ms-2" style={{ backgroundColor: "#A8577E", border: "0px" }}>
                <FaSearch />
              </Button>
            </Form>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Acetaminophen - pain, cold, flu... - age 12+</span>
              <Button style={{ backgroundColor: "#A8577E", border: "0px" }}>Add to Prescription</Button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Acetaminophen - pain, cold, flu... - age 12+</span>
              <Button style={{ backgroundColor: "#A8577E", border: "0px" }}>Add to Prescription</Button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Acetaminophen - pain, cold, flu... - age 12+</span>
              <Button style={{ backgroundColor: "#A8577E", border: "0px" }}>Add to Prescription</Button>
            </div>
          </Card>
        </Col> */}

        {/* Availability Section */}
        {/* <div className="container mt-4"> */}
        <h3 className="mb-3">Appointment Availability</h3>
        <Col md={6}>
          {/* Date Picker */}
          <div className="mb-3">
            <label className="form-label"><strong>Selected Date: </strong>{selectedDate.toDateString()}</label>
          </div>
          <div >
            {/* Calendar with available dates highlighted */}
            <Calendar onChange={handleDateChange} value={selectedDate}/>
          </div>
        </Col>
        <Col md={6}>
          <h5>Available Time Slots</h5>
          {availableTimeSlots.length > 0 ? (
            <table className="table table-bordered table-striped mt-3">
              <thead className='table-danger'>
                <tr>
                  <th>#</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableTimeSlots.map((slot, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{new Date(slot.start_time).toLocaleTimeString()}</td>
                    <td>{new Date(slot.end_time).toLocaleTimeString()}</td>
                    <td>{slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}</td>
                    <td>
                      <button className="btn btn-sm me-2" style={{backgroundColor:"#A8577E", color:"white"}} onClick={() => handleEditTimeSlot(index)}>Edit</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteTimeSlot(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No available time slots for this date.</p>
          )}

          {/* Edit or Add Time Slot Form */}
          <div className="mt-4">
            <h5>{editingSlot !== null ? 'Edit Time Slot' : 'Add New Time Slot'}</h5>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Start Time:</label>
                <input
                  type="time"
                  className="form-control"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Time:</label>
                <input
                  type="time"
                  className="form-control"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Status:</label>
                <select
                  className="form-select"
                  value={newSlot.status}
                  onChange={(e) => setNewSlot({ ...newSlot, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn w-100" style={{backgroundColor:"#A8577E", color:"white"}} onClick={editingSlot !== null ? handleUpdateTimeSlot : handleAddTimeSlot}>
                  {editingSlot !== null ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
         
        </Col>
        
        {/* </div> */}
      </Row>
    </Container>
  </>
};

export default Doctor;
