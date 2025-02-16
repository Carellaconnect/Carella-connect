import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username, 'Password:', password);
    // Add your login logic here
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="px-4 py-3" style={{ backgroundColor: "#F7D9E1" }}>
        <Navbar.Brand href="#">
          <img src="../images/Logo.png" alt="Logo" width="100" className="me-2" />
          <strong style={{fontSize:"30px"}}>Carella Connect</strong> <span style={{fontSize:"12px"}}>Bridging the Gap in Healthcare!</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
        <Nav>
            <Link to="/home">
              <Button variant="outline-dark" className="me-2">Home</Button>
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
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3 text-start">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
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

                <Button variant="primary" type="submit" block>
                  Sign In
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
