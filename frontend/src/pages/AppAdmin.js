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

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    gender: '',
    status: 'Active',
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

  // admin add handle modal 

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setAdminFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      gender: '',
      status: 'Active',
    });
    setShowAdminModal(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminFormData({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      phone: admin.phone,
      address: admin.address,
      gender: admin.gender,
      status: "Active",
    });
    setShowAdminModal(true);
  };

  //handle input change

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData({ ...adminFormData, [name]: value });
  };

  // handle submit

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingAdmin) {
        // Update existing admin
        res = await axios.put(`http://localhost:5000/api/admins/${editingAdmin._id}`, adminFormData);
        // Update the admin in the state
        setAdmins(admins.map(admin => admin._id === editingAdmin._id ? res.data : admin));
      } else {
        // Add new admin
        res = await axios.post('http://localhost:5000/api/admins', {
          ...adminFormData,
          hospital_id: selectedHospital,
        });
        // Add the newly added admin to the state
        setAdmins([...admins, res.data]);  // Add the new admin at the end of the admins list
      }
  
      setShowAdminModal(false);  // Close the modal
    } catch (error) {
      console.error('Admin submit error:', error);
    }
  };
  //delete admin

  const handleDeleteAdmin = (adminId) => {
    axios.delete(`http://localhost:5000/api/admins/${adminId}`)
      .then(() => {
        setAdmins(admins.filter(admin => admin._id !== adminId));
      })
      .catch((error) => {
        console.error('Error deleting admin:', error);
      });
  };


  return (
    <>
      <Navigation />
<Container fluid style={{
          margin: "0px", padding: "0px",
          backgroundImage: "url('/images/1background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}>
      {/* Show notification if message is set */}
      {notification.message && (
        <div className={`alert alert-${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      <Container>
        <Row className="pt-4">
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
            <Button className="btn btn-sm me-5" style={{ backgroundColor: "#A8577E", color: "white", border: "0px" }} onClick={handleAddHospital}>Add Hospital</Button>
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
                          <Button className="btn btn-sm me-2" style={{ backgroundColor: "#F4A5AE", color: "black", border: "0px" }} onClick={() => handleEditAdmin(admin)}>Edit</Button>
                          <Button className="btn btn-secondary btn-sm" onClick={() => handleDeleteAdmin(admin._id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button className="btn btn-sm me-5" style={{ backgroundColor: "#A8577E", color: "white", border: "0px" }}onClick={ handleAddAdmin}>Add Admin</Button>
              </Col>
              <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleAdminSubmit}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" value={adminFormData.name} onChange={handleAdminInputChange} required />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" value={adminFormData.email} onChange={handleAdminInputChange} required />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" name="password" value={adminFormData.password} onChange={handleAdminInputChange} required />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control name="phone" value={adminFormData.phone} onChange={handleAdminInputChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control name="address" value={adminFormData.address} onChange={handleAdminInputChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select name="gender" value={adminFormData.gender} onChange={handleAdminInputChange}>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Control name="status" value="Active" required disabled/>
                    </Form.Group>
                    <Button className="mt-3" type="submit">
                      {editingAdmin ? 'Update Admin' : 'Add Admin'}
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
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
      </Container>
    </>
  );
};

export default Dashboard;
