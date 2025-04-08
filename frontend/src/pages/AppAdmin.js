import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Row, Col, Form, Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './Navigation';

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [hospitalFormData, setHospitalFormData] = useState({
    name: '',
    address: '',
    contact_number: '',
    email: '',
  });

  // Fetch hospital data
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/hospitals');
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, []);


  // Handle Delete Hospital
  const handleDelete = (hospitalId) => {
    axios.delete(`http://localhost:5000/api/hospitals/${hospitalId}`)
      .then(() => {
        setHospitals(hospitals.filter(hospital => hospital._id !== hospitalId));
      })
      .catch((error) => {
        console.error('Error deleting hospital:', error);
      });
  };
  // Handle Edit Hospital
  const handleEdit = (hospital) => {
    setSelectedHospital(hospital);
    setHospitalFormData({
      name: hospital.name,
      address: hospital.address,
      contact_number: hospital.contact_number,
      email: hospital.email,
    });
    setShowModal(true);
  };

  // Handle Add New Hospital
  const handleAddHospital = () => {
    setSelectedHospital(null);
    setHospitalFormData({
      name: '',
      address: '',
      contact_number: '',
      email: '',
    });
    setShowModal(true);
  };

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHospitalFormData({
      ...hospitalFormData,
      [name]: value,
    });
  };

  // Handle Form Submit (Add/Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedHospital) {
      // Edit existing hospital
      axios.put(`http://localhost:5000/api/hospitals/${selectedHospital._id}`, hospitalFormData)
        .then((response) => {
          setHospitals(hospitals.map(hospital => hospital._id === selectedHospital._id ? response.data : hospital));
          setShowModal(false);
        })
        .catch((error) => {
          console.error('Error updating hospital:', error);
        });
    } else {
      // Add new hospital
      axios.post('http://localhost:5000/api/hospitals', hospitalFormData)
        .then((response) => {
          setHospitals([...hospitals, response.data]);  // Add the newly added hospital to the list
          setShowModal(false);  // Close the modal
        })
        .catch((error) => {
          console.error('Error adding hospital:', error);
        });
    }
  };

  // Fetch doctors & admin based on selected hospital
  useEffect(() => {
    if (selectedHospital) {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/doctors/hospital/${selectedHospital}`
          );
          setDoctors(response.data);
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };
      const fetchAdmins = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/admins/hospital/${selectedHospital}`
          );
          setAdmins(response.data);
        } catch (error) {
          console.error('Error fetching admins:', error);
        }
      };
      fetchAdmins();
      fetchDoctors();
    }
  }, [selectedHospital]);

  // Handle hospital selection
  const handleHospitalSelection = (hospitalId) => {
    setSelectedHospital(hospitalId);
  };


  return (
    <>
      <Navigation />

      {/* Show notification if message is set */}
      {notification.message && (
        <div className={`alert alert-${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      <Container>
        <Row className="my-4">
          {/* Top Section: List of Hospitals */}
          <Col md={12}>
            <h4>List of Hospitals</h4>
            <Table striped bordered hover responsive style={{ marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <tr key={hospital._id}>
                    <td>
                      <Form.Check
                        type="radio"
                        name="hospital"
                        id={`hospital-${hospital._id}`}
                        onChange={() => handleHospitalSelection(hospital._id)}
                        checked={selectedHospital === hospital._id}
                      />
                    </td>
                    <td>{hospital.name}</td>
                    <td>{hospital.address}</td>
                    <td>{hospital.contact_number}</td>
                    <td>{hospital.email}</td>
                    <td style={{ width: '200px' }}>
                      <Button className="btn btn-sm me-2" style={{ backgroundColor: "#F4A5AE", color: "black", border: "0px" }} onClick={() => handleEdit(hospital)}>Edit</Button>
                      <Button className="btn btn-secondary btn-sm" onClick={() => handleDelete(hospital._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button className="btn btn-sm float-end me-5" style={{ backgroundColor: "#A8577E", color: "white", border: "0px" }} onClick={handleAddHospital}>Add Hospital</Button>
          </Col>

          {/* Modal for Add/Edit Hospital */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedHospital ? 'Edit Hospital' : 'Add Hospital'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formHospitalName">
                  <Form.Label>Hospital Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={hospitalFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHospitalAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={hospitalFormData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formHospitalContact">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_number"
                    value={hospitalFormData.contact_number}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formHospitalEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={hospitalFormData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" style={{ margin: '20px' }} type="submit">
                  {selectedHospital ? 'Update Hospital' : 'Add Hospital'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          {/* Bottom Section: List of Admins and Doctors for Selected Hospital */}
          {selectedHospital && (
            <>
              <Col style={{ marginTop: '20px' }} md={12}>
                <h4>Admins in Selected Hospital</h4>
                <Table striped bordered hover responsive style={{ marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th style={{ width: '200px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin._id}>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>{admin.phone}</td>
                        <td>
                          <Button className="btn btn-sm me-2" style={{ backgroundColor: "#F4A5AE", color: "black", border: "0px" }} onClick={() => handleEdit(admin)}>Edit</Button>
                          <Button className="btn btn-secondary btn-sm" onClick={() => handleDelete(admin._id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button className="btn btn-sm float-end me-5" style={{ backgroundColor: "#A8577E", color: "white", border: "0px" }}>Add Admin</Button>
              </Col>
              <Col style={{ marginTop: '20px' }} md={12}>
                <h4>Doctors in Selected Hospital</h4>
                <Table striped bordered hover responsive style={{ marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Speciality</th>
                      <th>Status</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td>{doctor.name}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.speciality}</td>
                        <td>{doctor.status}</td>

                      </tr>
                    ))}
                  </tbody>
                </Table>

              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
