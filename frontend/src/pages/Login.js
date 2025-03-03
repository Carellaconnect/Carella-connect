import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
        const response = await axios.post('http://localhost:5000/login', { email, password });
        console.log(response.data);

        setSuccess(response.data.message);
        setLoading(false);

      if (response.data.role === 'Admin') {
          window.location.href = '/admin-dashboard';
      } else if (response.data.role === 'Doctor') {
          window.location.href = '/doctor-dashboard';
      } else if (response.data.role === 'Patient') {
          window.location.href = '/patient-dashboard';
      } else {
          window.location.href = '/';
      }
    } catch (error) {
        setLoading(false);
        if (error.response && error.response.data.message) {
            setError(error.response.data.message); // Display the error message
        } else {
            setError('An error occurred. Please try again.');
        }
    }
};


  return (
    <>
      <Navbar expand="lg" className="px-4 py-3" style={{ backgroundColor: "#F7D9E1" }}>
        <Navbar.Brand href="#">
          <img src="../images/Logo.png" alt="Logo" width="100" className="me-2" />
          <strong style={{ fontSize: "30px" }}>Carella Connect</strong>
          <span style={{ fontSize: "12px" }}>Bridging the Gap in Healthcare!</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Link to="/home">
              <Button variant="outline-dark" className="me-2">Back</Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col md={6} lg={4} className="mx-auto">
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <h3 className="text-center mb-4">Sign In</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail" className="mb-3 text-start">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

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

                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
