import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container, Row, Col, Card, Modal, Form, Alert } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



const services = [
  { name: "Online Appointments", description: "Easily search for doctors and hospitals and schedule appointments in just a few clicks.", img: "/images/online.jpg" },
  { name: "Virtual Consultations", description: "Connect with healthcare professionals through secure online video consultations.", img: "/images/virtual.jpg" },
  { name: "Medical Records Access", description: "View and manage your medical history with secure, read-only access.", img: "/images/medical.jpg" },
  { name: "Prescription Management", description: "Order medicines online and receive reminders for prescriptions and refills.", img: "/images/medication.jpg" },
  { name: "Emergency Assistance", description: "Quickly contact emergency services or locate the nearest hospital when needed.", img: "/images/emergency.jpg" },
  { name: "Health Education & Resources", description: "Access expert-reviewed articles, videos, and wellness tips for a healthier life.", img: "/images/education.jpg" }
];

const Home = ({ }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyDetails, setEmergencyDetails] = useState({
    name: '',
    emergencyType: '',
    location: '',
    details: '',
    urgency: '',
    phoneNumber: ''
  });
  const [responseMessage, setResponseMessage] = useState(""); // State for response message
  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setUserRole(storedUser.role); // Set the role correctly
      setIsLoggedIn(true);
      navigate(getDashboardLink(storedUser.role)); // Directly call the getDashboardLink with stored role
    }
  }, [navigate]); useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
      setUserRole(storedUser.role);
      navigate(getDashboardLink());
    }
  }, []);
  // Handle Login 
  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = e.target.elements;

    // Replace with your authentication logic
    if (username.value === 'test' && password.value === 'password') {
      const userData = { username: username.value, role: 'patient' }; // Set the role here
      setUser(userData);
      setUserRole(userData.role); // Set userRole here
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    if (user && user.phoneNumber) {
      setEmergencyDetails((prev) => ({ ...prev, phoneNumber: user.phoneNumber }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmergencyDetails({ ...emergencyDetails, [name]: value });
  };

  const handleEmergencySubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...emergencyDetails,
          userId: user ? user._id : null
        })
      });

      const data = await response.json();
      if (data.success) {
        setResponseMessage(data.message); // Set the response message
        setFormSubmitted(true); // Mark form as submitted
      } else {
        setResponseMessage("Error: " + data.message);
        setFormSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting emergency request:", error);
      setResponseMessage("Failed to submit request.");
      setFormSubmitted(true);
    }
  };

  const handleHealthEducationClick = () => {

    navigate("/virtual-health-resources");

  };
  const handleEmergencyClick = () => {
    setShowEmergencyModal(true);
  };

  const getDashboardLink = () => {
    const role = user?.role?.toLowerCase();  // Ensure user has role
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'app_admin':
        return '/appadmin-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      default:
        return '#'; // Fallback if role is not found
    }
  };
  const handleButtonClick = () => {
    const role = user?.role?.toLowerCase();  // Ensure user has role
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'app_admin':
        return '/appadmin-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/patient-dashboard';
      default:
        return '/login';
    }
  };



  console.log("Is Logged In:", isLoggedIn);

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="px-4 py-3" style={{ backgroundColor: "#F7D9E1" }}>

        {/* Left: Logo */}
        <Navbar.Brand href="#" className="m-0">
          <img src="/images/Logo.png" alt="Logo" width="100" />
        </Navbar.Brand>

        {/* Center: Title and Subtitle */}
        <div className="text-center" style={{ marginLeft: "380px" }}>
          <strong style={{ fontSize: "45px", color: "#2596a7" }}>Carella   Connect</strong>
          <span style={{ fontSize: "12px", color: "brown" }}>  Bridging the Gap in Healthcare!</span>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {isLoggedIn ? (  // If user is logged in, show dashboard options
            <Nav className="ms-auto" style={{}}>


              {/* Role-based Dashboard Link */}

              <Nav.Link href={getDashboardLink()} style={{ backgroundColor: "#F4A5AE", border: "0px", borderRadius: "5px", color: "black" }} className="me-2">Dashboard</Nav.Link>

              <Nav.Link onClick={handleLogout} style={{ backgroundColor: "#A8577E", border: "0px", borderRadius: "5px" }}>
                Log Out
              </Nav.Link>

            </Nav>
          ) : (  // If user is NOT logged in, show signup and login buttons
            <Nav>
              <Link to="/register">
                <Button style={{ backgroundColor: "#F4A5AE", border: "0px", color: "black" }} className="me-2">
                  SignUp
                </Button>
              </Link>
              <Link to="/login">
                <Button style={{ backgroundColor: "#A8577E", border: "0px" }}>
                  Login
                </Button>
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Container fluid
        style={{
          margin: "0px", padding: "0px",
          backgroundImage: "url('/images/1background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}>

        {/* Hero Section */}
        <Container fluid className="hero-section" style={{ height: "55vh", objectFit: "cover" }}>
          <Row className="align-items-center">
            <Col md={4} className="p-0">
              <img src="/images/drhand.png" alt="Doctor Left" className="img-fluid w-100 hero-img" />
            </Col>
            <Col md={4} className="text-center py-5">
              <h2>Carella Connect – Bridging the Gap in Healthcare!</h2>
              <p>Bringing quality healthcare closer to you. Find doctors, access medical records, and receive medication alerts.</p>
              {/* Buttons wrapped inside a div for flexbox alignment */}
              <div className="d-flex flex-column gap-2 align-items-center">

                <Button style={{ backgroundColor: "#A8577E", border: "none", padding: "10px 20px", fontSize: "1.2rem" }} href={handleButtonClick()} >
                  Book Now
                </Button>

                <Button onClick={() => setShowEmergencyModal(true)} style={{ backgroundColor: "#A8577E", border: "0px", padding: "12px 24px", fontSize: "1.2rem" }}>
                  Request Emergency Help
                </Button>
              </div>
            </Col>
            <Col md={4} className="p-0">
              <img src="/images/pthand.png" alt="Patient Right" className="img-fluid w-100 hero-img" />
            </Col>
          </Row>
        </Container>

        {/* Emergency Request Modal */}
        <Modal show={showEmergencyModal} onHide={() => setShowEmergencyModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>🚨 Emergency Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formSubmitted ? (
              <div>
                {/* Response Message */}
                <Alert variant="info" className="text-center">
                  {responseMessage}
                </Alert>
                <Button variant="primary" onClick={() => setShowEmergencyModal(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <Form onSubmit={(e) => { e.preventDefault(); handleEmergencySubmit(); }}>
                {!user && ( // Show the Name field only if the user is NOT logged in
                  <Form.Group controlId="name">
                    <Form.Label>Your Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={emergencyDetails.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="emergencyType">
                  <Form.Label>Emergency Type *</Form.Label>
                  <Form.Control
                    as="select"
                    name="emergencyType"
                    value={emergencyDetails.emergencyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Emergency Type</option>
                    <option value="Medical">🚑 Medical</option>
                    <option value="Fire">🔥 Fire</option>
                    <option value="Safety">🔒 Safety</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="location">
                  <Form.Label>Location/Room *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="e.g., Room 305, Lobby"
                    value={emergencyDetails.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="details">
                  <Form.Label>Additional Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="details"
                    rows={3}
                    placeholder="Describe the situation..."
                    value={emergencyDetails.details}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="urgency">
                  <Form.Label>Urgency Level *</Form.Label>
                  <Form.Control
                    as="select"
                    name="urgency"
                    value={emergencyDetails.urgency}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Urgency Level</option>
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟠 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="phoneNumber">
                  <Form.Label>Callback Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter your phone number, (10 digits, no country code)"
                    value={emergencyDetails.phoneNumber}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>

                <div style={{ marginTop: "20px" }}> {/* This creates the gap */}
                  <Button type="submit" style={{ backgroundColor: "#A8577E", border: "none", padding: "10px 20px", fontSize: "1.2rem", marginBottom: "10px" }}>
                    Submit Request
                  </Button>
                </div>
              </Form>
            )}
          </Modal.Body>
        </Modal>

        {/* Services */}

        <Container className="my-5 text-center p-5 pt-3 pb-3" style={{ borderRadius: "15px", boxShadow: "2px 2px 5px 3px #bcbcbc" }}>
          <h3 className='mt-0 pt-0 pb-3'>Services</h3>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={3}  // Show 3 cards at a time
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1 }, // For mobile
              768: { slidesPerView: 2 }, // For tablets
              1024: { slidesPerView: 3 } // For larger screens
            }}
          >
            {services.map((service, index) => (
              <SwiperSlide key={index}>
                <Card className="shadow-sm mb-5">
                  <Card.Img variant="top" src={service.img} />
                  <Card.Body>
                    <Card.Title>{service.name}</Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                    <Button
                      style={{ backgroundColor: "#A8577E", border: "0px" }}
                      onClick={() => {
                        if (service.name === "Emergency Assistance") {
                          handleEmergencyClick(); // Show emergency modal
                        } else if (service.name === "Health Education & Resources") {
                          handleHealthEducationClick(); // Navigate to health education page
                        } else {
                          window.location.href = handleButtonClick(); // Use window.location.href for direct navigation
                        }
                      }}
                    >

                      Learn More</Button>
                  </Card.Body>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>

        {/* How It Works */}
        <Container className="text-center my-5" style={{}}>
          <h3>How It Works</h3>
          <Row>
            {[{ id: 1, title: "Book an Appointment", text: "No more waiting for hours in a walk-in clinic or weeks to see your family doctor. Doctors on your schedule, book online.", button: "Book Now" },
            { id: 2, title: "Consult a Doctor", text: "Speak directly with doctors in Canada by phone, video, or secure messaging, on any device. You’re in control and your time is valuable.", button: "Available Doctors" },
            { id: 3, title: "Safe and Sound", text: "Receive referrals, requisitions and any other documents you need, all online. Free prescription delivery in Canada.", button: "Get Started" }]
              .map((step) => (
                <Col key={step.id} className="m-4 p-4" style={{ borderRadius: "160px", boxShadow: "2px 2px 5px 3px #bcbcbc", width: "600px", backgroundColor: "white" }}>
                  <p className="badge p-3" style={{ backgroundColor: "#A8577E", borderRadius: "95%", fontSize: "15px" }}>{step.id}</p>
                  <h5 className='mt-3'>{step.title}</h5>
                  <p>{step.text}</p>
                  <Button className='mt-3 p-2' style={{ backgroundColor: "#A8577E", border: "0px" }} href={handleButtonClick()}
                  >{step.button}</Button>
                </Col>
              ))}
          </Row>
        </Container>

        {/* Features */}
        <Container fluid className="my-5 p-4 text-center" style={{ backgroundColor: "#F7D9E1" }}>
          <h3>Features</h3>
          <Row className="mt-3">
            {[{ title: "Search and Book Appointments", icon: "🔍", detail: "Find doctors/hospitals and schedule consultations" },
            { title: "Medical Record Access", icon: "📄", detail: "View past prescriptions, diagnoses, and reports (read-only)" },
            { title: "Virtual Health Resources", icon: "📚", detail: "Educational content on common health concerns and self-care" },
            { title: "Notifications & Alerts", icon: "🔔", detail: "Reminders for upcoming appointments and medication schedules" },
            { title: "Emergency Services Request", icon: "🚑", detail: "Quick access to emergency contacts and assistance" },
            { title: "Medication Delivery or Pickup", icon: "💊", detail: "Option to receive prescribed medicines at home or pick them up" }]
              .map((feature, index) => (
                <Col md={4} key={index} className="d-flex align-items-center">
                  <h1 className='m-2 mb-3'>{feature.icon}</h1>
                  <div className='text-start'>
                    <h5>{feature.title}</h5>
                    <p>{feature.detail}</p>
                  </div>
                </Col>
              ))}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default Home;