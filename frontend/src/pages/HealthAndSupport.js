import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import Navigation from './Navigation';

const SupportPage = () => {
  return (
    <>
          <Navigation /> 
    <Container className="pt-5" fluid style={{
          margin: "0px", padding: "0px",
          backgroundImage: "url('/images/1background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="text-white" style={{backgroundColor:"#A8577E"}}>
              <h3>Help & Support</h3>
            </Card.Header>
            <Card.Body>
              <h5>Contact us for assistance in the following areas:</h5>
              <ListGroup variant="flush">
                {/* App-related Support */}
                <ListGroup.Item>
                  <h6>App-Related Issues</h6>
                  <p>If you're having trouble with the app, feel free to reach out to us:</p>
                  <p>Email: <a href="mailto:support@app.com">support@app.com</a></p>
                  <p>Phone: <a href="tel:+123456789">+1 (234) 567-89</a></p>
                </ListGroup.Item>

                {/* Admin-related Support */}
                <ListGroup.Item>
                  <h6>Admin-Related Inquiries</h6>
                  <p>If you have administrative questions, please contact the admin team:</p>
                  <p>Email: <a href="mailto:admin@ourapp.com">admin@ourapp.com</a></p>
                  <p>Phone: <a href="tel:+987654321">+9 (876) 543-21</a></p>
                </ListGroup.Item>

                {/* Hospital-related Support */}
                <ListGroup.Item>
                  <h6>Hospital-Related Inquiries</h6>
                  <p>If you need assistance related to hospitals or appointments:</p>
                  <p>Email: <a href="mailto:hospital@ourapp.com">hospital@ourapp.com</a></p>
                  <p>Phone: <a href="tel:+1122334455">+1 (123) 334-455</a></p>
                </ListGroup.Item>

                {/* Doctor-related Support */}
                <ListGroup.Item>
                  <h6>Doctor-Related Inquiries</h6>
                  <p>If you need assistance with doctor-related queries:</p>
                  <p>Email: <a href="mailto:doctor@ourapp.com">doctor@ourapp.com</a></p>
                  <p>Phone: <a href="tel:+1010101010">+1 (010) 101-0101</a></p>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default SupportPage;
