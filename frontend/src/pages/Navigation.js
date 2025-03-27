import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.name) {
      setUserName(userData.name);
      setUserRole(userData.role); // Set the role as well
    }
  }, []);

  const getDashboardLink = () => {
    const role = userRole.toLowerCase();
    switch (role) {  // Use userRole instead of user
      case  'admin':
        return '/admin-dashboard';  
      case 'doctor':
        return '/doctor-dashboard'; 
      case 'patient':
        return '/patient-dashboard'; 
      default:
        return '#';  
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");  
    navigate("/login"); 
  };

  // Check if the user is logged in
  const isLoggedIn = userName !== '';  // User is logged in if the userName exists

  return (
    <>
      <Navbar expand="lg" className="px-4 py-3 m-0" style={{ backgroundColor: "#F7D9E1" }}>
        <Navbar.Brand href="#">
          <img src="../images/Logo.png" alt="Logo" width="100" className="me-2" />
          <strong style={{ fontSize: "30px" }}>Carella Connect</strong> <span style={{ fontSize: "12px" }}>Bridging the Gap in Healthcare!</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {isLoggedIn && (
            <Nav className="ms-auto">
              <span className="me-3 fw-bold">Welcome, {userName}!</span>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>

      {isLoggedIn ? ( // Show navigation only if user is logged in
        <Nav className="ms-auto">
          <Nav.Link href="/home" className="text-dark">Home</Nav.Link>
          <span style={{ border: "1px solid #a6a6a6" }}></span>

          {/* Role-based Dashboard Link */}
          <Nav.Link href={getDashboardLink()} className="text-dark">Dashboard</Nav.Link>
          <span style={{ border: "1px solid #a6a6a6" }}></span>

          <Nav.Link href="/profile-page" className="text-dark">Profile</Nav.Link>
          <span style={{ border: "1px solid #a6a6a6" }}></span>

          <Nav.Link href="/virtual-health-resources" className="text-dark">Virtual Health Resources</Nav.Link>
          <span style={{ border: "1px solid #a6a6a6" }}></span>

          <Nav.Link href="/health-and-support" className="text-dark">Help & Support</Nav.Link>
          <span style={{ border: "1px solid #a6a6a6" }}></span>

          <Nav.Link onClick={handleLogout} className="text-dark" style={{ cursor: "pointer" }}>
            Log Out
          </Nav.Link>
          <span style={{ border: "1px solid #a6a6a6" }}></span>
        </Nav>
      ) : (
        <Nav className="ms-auto" style={{borderBottom:" 2px solid #d7d7d7"}}>
        <Nav.Link href="/Home" className='text-dark'>Home</Nav.Link>
        <span style={{border:"1px solid #a6a6a6"}}></span>
        <Nav.Link href="/login" className='text-dark' >Log In</Nav.Link>
        <span style={{border:"1px solid #a6a6a6"}}></span>
      </Nav>

      )}
    </>
  );
};

export default Navigation;
