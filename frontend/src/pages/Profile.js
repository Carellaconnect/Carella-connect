import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { Card, ListGroup, Container, Row, Col } from 'react-bootstrap';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    } else {
      console.error('User data not found in localStorage');
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

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
      <Container className="pt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-none" style={{ border: '1px solid #ddd' }}> {/* Remove box shadow and set border */}
              <Card.Header
                className="text-center text-white"
                style={{
                  backgroundColor: '#A8577E',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '1.2rem',
                  color: 'white',
                  marginBottom: '10px',
                }}
              >
                <h3>Profile Information</h3>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Name:</strong> {user.name}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Email:</strong> {user.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Phone:</strong> {user.phone}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Address:</strong> {user.address}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>City:</strong> {user.city}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Province:</strong> {user.province}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Postcode:</strong> {user.postcode}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Gender:</strong> {user.gender}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong> {user.status}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      </Container>
    </>
  );
};

export default ProfilePage;
