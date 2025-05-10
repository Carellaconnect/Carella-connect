import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './Navigation';
import axios from 'axios';


const Register = () => {
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postcode, setPostcode] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setSelectedRole] = useState("");
    const [dob, setDob] = useState("");
    const [insuranceId, setInsuranceId] = useState("");
    const [insuranceProvider, setInsuranceProvider] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [gender, setGender] = useState("");
    const [language, setLanguage] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const [isPatient, setIsPatient] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState("");
    const [hospitalsList, setHospitalsList] = useState([]);
    const [formData, setFormData] = useState('');

    useEffect(() => {
      fetch("http://localhost:5000/api/hospital-data")
        .then((response) => response.json())
        .then((data) => {
          if(data.error) {
            data = [];
          } else { 
           setHospitalsList(data);
          }
        })
        .catch((error) =>
          console.error("Error fetching hospital list:", error)
        );
    }, []);

  // Handler function for dropdown change event
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    console.log(event.target.value);
    if(event.target.value.toLowerCase() === 'doctor'){
      setIsPatient(false);
      setIsDoctor(true);
      setIsAdmin(false);
    } else if(event.target.value.toLowerCase() === 'admin') {
      setIsPatient(false);
      setIsDoctor(false);
      setIsAdmin(true);
    } else {
      setIsDoctor(false);
      setIsAdmin(false);
      setIsPatient(true);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleSpecialityChange = (event) => {
    setSpeciality(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleHospitalIdChange = (event) => {
    setHospitalId(event.target.value);
  };

    // Validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // // Validate email (required and valid format)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      formErrors.email = 'Email is not valid';
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      formErrors.password = 'Password is not valid';
      isValid = false;
    }

    setError(formErrors);
    return isValid;
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        let formErrors = {};
        try {
          const formData = {
            email,
            fname,
            lname,
            password,
            address,
            city,
            province,
            postcode,
            phone,
            role,
            dob,
            insuranceId,
            insuranceProvider,
            hospitalId,
            doctorId,
            gender,
            isDoctor,
            licenseNumber,
            speciality,
            language,
          };

          setFormData(formData);
          
          if (validateForm()) {
            let formErrors = {};
            try {
              const response = await axios.post('http://localhost:5000/register', formData);
              console.log(response.data);
              setSuccess(response.data.message);
              setLoading(false);
            } catch (error) {
              setLoading(false);
              console.log('Inside catch');
              if (error.response && error.response.data.message) {
                formErrors.backendError = error.response.data.message;
                setError(formErrors); // Display the error message
              } else {
                formErrors.backendError = "An error occurred. Please try again.";
                setError(formErrors);
              }
          }
          } else{
            setLoading(false);
          }
        } catch (error) {
           
        }
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Navigation></Navigation>
            
<Container fluid style={{
          margin: "0px", padding: "0px",
          backgroundImage: "url('/images/1background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}>
            <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
                    <Row className="w-100">
                      <Col md={6} lg={6} className="mx-auto">
                        <Card className="p-4 shadow-sm">
                          <Card.Body>
                            <h3 className="text-center mb-4">Register</h3>

                            {error && (
                              <div>
                                {error.email && <p className="alert alert-danger">{error.email}</p>}
                                {error.password && <p className="alert alert-danger">{error.password}</p>}
                                {error.backendError && <p className="alert alert-danger">{error.backendError}</p>}
                              </div>
                            )}
                            {success && <div className="alert alert-success">{success}</div>}

                            <Form onSubmit={handleSubmit}>
                              <Row>
                                <Col>
                                  <Form.Group controlId="firstName" className="mb-3 text-start">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter First Name"
                                      value={fname}
                                      onChange={(e) => setFname(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="lastName" className="mb-3 text-start">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Last Name"
                                      value={lname}
                                      onChange={(e) => setLname(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="formEmail" className="mb-3 text-start">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Email Address"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="formPassword" className="mb-3 text-start">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                      type="password"
                                      placeholder="Enter your password"
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="formRole" className="mb-3 text-start">
                                    <Form.Label>Select Role</Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={role}
                                      onChange={handleRoleChange}
                                    >
                                      <option value="">--Select an option--</option>
                                      <option value="patient">Patient</option>
                                      <option value="doctor">Doctor</option>
                                      <option value="admin">Admin</option>
                                    </Form.Control>
                                </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="formGender" className="mb-3 text-start">
                                    <Form.Label>Select Gender</Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={gender}
                                      onChange={handleGenderChange}
                                    >
                                      <option value="">--Select an option--</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Other">Other</option>
                                    </Form.Control>
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="formAddress" className="mb-3 text-start">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter your address"
                                      value={address}
                                      onChange={(e) => setAddress(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="formCity" className="mb-3 text-start">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter your City"
                                      value={city}
                                      onChange={(e) => setCity(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <Form.Group controlId="formProvince" className="mb-3 text-start">
                                    <Form.Label>Province</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter your province"
                                      value={province}
                                      onChange={(e) => setProvince(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="formPostcode" className="mb-3 text-start">
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter your postcode"
                                      value={postcode}
                                      onChange={(e) => setPostcode(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <Row>
                                <Col>
                                  <Form.Group controlId="formPhone" className="mb-3 text-start">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter your phone number"
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="formDob" className="mb-3 text-start">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                      type="date"
                                      placeholder="Enter your date of birth"
                                      value={dob}
                                      onChange={(e) => setDob(e.target.value)}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              {isPatient && (
                                <>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="formInsuranceId" className="mb-3 text-start">
                                      <Form.Label>Insurance ID</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter your insurance ID"
                                        value={insuranceId}
                                        onChange={(e) => setInsuranceId(e.target.value)}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group controlId="formInsurance Provider" className="mb-3 text-start">
                                      <Form.Label>Insurance Provider</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter your insurance provider"
                                        value={insuranceProvider}
                                        onChange={(e) => setInsuranceProvider(e.target.value)}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                                </>
                              )}
                              
                              {isDoctor && (
                                <>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="formHospitalId" className="mb-3 text-start">
                                      <Form.Label>Select Hospital</Form.Label>
                                      <Form.Control
                                      as="select"
                                      value={hospitalId}
                                      onChange={handleHospitalIdChange}
                                      required>
                                        <option value="">--Select an option--</option>
                                        {hospitalsList.map((option) => (
                                          <option key={option._id} value={option._id}>
                                            {option.name}
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group controlId="formDoctorId" className="mb-3 text-start">
                                      <Form.Label>Doctor's ID</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter the doctor's indentification number."
                                        value={doctorId}
                                        onChange={(e) => setDoctorId(e.target.value)}
                                        required
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <Form.Group controlId="formLicenseNumber" className="mb-3 text-start">
                                      <Form.Label>License Number</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Enter the doctor's license number."
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        required
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group controlId="formSpeciality" className="mb-3 text-start">
                                      <Form.Label>Select Speciality</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={speciality}
                                        onChange={handleSpecialityChange}
                                      >
                                        <option value="">--Select an option--</option>
                                        <option value="Dentist">Dentist</option>
                                        <option value="Orthopediac">Orthopediac</option>
                                        <option value="Dermatologist">Dermatology</option>
                                        <option value="Surgeon">Surgery</option>
                                        <option value="Psychiatrist">Psychiatry</option>
                                        <option value="Family Medicine">Family Medicine</option>
                                        <option value="General Medicine">General Medicine</option>

                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                  <Form.Group controlId="formLanguage" className="mb-3 text-start">
                                      <Form.Label>Language Preference</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={language}
                                        onChange={handleLanguageChange}
                                      >
                                        <option value="">--Select an option--</option>
                                        <option value="EN">English</option>
                                        <option value="FR">French</option>
                                        <option value="BOTH">Both</option>

                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
                                  <Col></Col>
                                </Row>
                              </>
                              )}

                              {isAdmin && (
                                <>
                                  <Row>
                                    <Col>
                                    <Form.Group controlId="formHospitalId" className="mb-3 text-start">
                                      <Form.Label>Select Hospital</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={hospitalId}
                                        onChange={handleHospitalIdChange}
                                        required>
                                          <option value="">--Select an option--</option>
                                          {hospitalsList.map((option) => (
                                            <option key={option._id} value={option._id}>
                                              {option.name}
                                            </option>
                                          ))}
                                      </Form.Control>
                                    </Form.Group>
                                    </Col>
                                    <Col></Col>
                                  </Row>
                                </>
                              )}

                              <Button variant="primary" type="submit" disabled={loading} style={{ backgroundColor: "#F4A5AE", border: "0px", color: "black" }}>
                                {loading ? 'Please wait..' : 'Register'}
                              </Button>
                            </Form>
            
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                  </Container>
        </>
    );
};

export default Register;
