import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './Navigation';
import { Table, Button } from 'react-bootstrap';
import {Nav,  Form, Card, Modal } from "react-bootstrap";
import { FaStar, FaSearch, FaBell } from "react-icons/fa";

const AdminDashboard = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [newStatus, setNewStatus] = useState("");


  useEffect(() => {
    fetch("http://localhost:5000/doctors-approval-requests")
      .then((response) => response.json())
      .then((data) => {
        setApprovalRequests(data);
      })
      .catch((error) =>
        console.error("Error fetching approval requests:", error)
      );
  }, []);
   // Fetch Emergency Requests
   useEffect(() => {
    fetch("http://localhost:5000/api/emergency-requests")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEmergencyRequests(data.data); 
        } else {
          console.error("Failed to fetch emergency requests");
        }
      })
      .catch((error) => console.error("Error fetching emergency requests:", error));
  }, []);

  // Handle approve action
  const handleApprove = (requestId) => {
    fetch(`http://localhost:5000/update-doctor-approval/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),  
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setApprovalRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === requestId
                ? { ...req, approval_status: "Approved" }
                : req
            )
          );
          setNotification({ message: 'Doctor approved successfully!Email Notification sent to Doctor', type: 'success' })
        }
      })
      .catch((error) => console.error("Error approving doctor:", error));
  };

  // Handle reject action
  const handleReject = (requestId) => {
    fetch(`http://localhost:5000/update-doctor-approval/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),  
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setApprovalRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === requestId
                ? { ...req, approval_status: "Rejected" }
                : req
            )
          );
          setNotification({ message: 'Doctor rejected successfully!Email notification sent to Doctor', type: 'danger' });
        }
      })
      .catch((error) => console.error("Error rejecting doctor:", error));
  };
  // Handle Status Change for Emergency Requests
  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  // Update Emergency Status
  const handleUpdateStatus = async () => {
    if (!selectedEmergency) return;

    try {
      const response = await fetch(`http://localhost:5000/api/emergency-requests/${selectedEmergency._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setEmergencyRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === selectedEmergency._id ? { ...req, status: newStatus } : req
          )
        );
        setShowModal(false);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const totalDoctors = approvalRequests.length;
const approvedDoctors = approvalRequests.filter(req => req.approval_status === "Approved").length;
const rejectedDoctors = approvalRequests.filter(req => req.approval_status === "Rejected").length;
const pendingDoctors = approvalRequests.filter(req => req.approval_status === "Pending").length; // New

const totalEmergencies = emergencyRequests.length;
const inProgressEmergencies = emergencyRequests.filter(req => req.status === "In Progress").length;
const resolvedEmergencies = emergencyRequests.filter(req => req.status === "Resolved").length;
const pendingEmergencies = emergencyRequests.filter(req => req.status === "Pending").length; // New


  return (
    <>
  
      
      <Navigation />
       
         {/* Show notification if message is set */}
    {notification.message && (
      <div className={`alert alert-${notification.type}`} role="alert">
        {notification.message}
      </div>
    )}
    
                
                <h3 className="text-center mb-4">Admin Dashboard</h3>
                                <div className="container mt-4">
                                  <div className="row">
                                    {/* Doctor Approval Stats Table */}
                                    <div className="col-md-6 mb-4">
                                      <h5>Doctor Approval Stats</h5>
                                      <Table bordered hover responsive style={{ width: '100%' }}>
                                        <thead className="thead-dark">
                                          <tr>
                                            <th style={{backgroundColor:"#A8577E"}
                                            }>Stat</th>
                                            <th style={{backgroundColor:"#A8577E"}
                                            }>Count</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>Total Doctors</td>
                                            <td>{totalDoctors}</td>
                                          </tr>
                                          <tr>
                                            <td>Approved Doctors</td>
                                            <td>{approvedDoctors}</td>
                                          </tr>
                                          <tr>
                                            <td>Pending Approvals</td>
                                            <td>{pendingDoctors}</td>
                                          </tr>
                                          <tr>
                                            <td>Rejected Doctors</td>
                                            <td>{rejectedDoctors}</td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                
                                    {/* Emergency Request Stats Table */}
                                    <div className="col-md-6 mb-4">
                                      <h5>Emergency Request Stats</h5>
                                      <Table bordered hover responsive style={{ width: '100%' }}>
                                        <thead className="thead-dark">
                                          <tr>
                                            <th style={{backgroundColor:"#A8577E"}} >Stat</th>
                                            <th style={{backgroundColor:"#A8577E"}}>Count</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            <td>Total Emergencies</td>
                                            <td>{totalEmergencies}</td>
                                          </tr>
                                          <tr>
                                            <td>Pending Emergencies</td>
                                            <td>{pendingEmergencies}</td>
                                          </tr>
                                          <tr>
                                            <td>In Progress Emergencies</td>
                                            <td>{inProgressEmergencies}</td>
                                          </tr>
                                          <tr>
                                            <td>Resolved Emergencies</td>
                                            <td>{resolvedEmergencies}</td>
                                          </tr>
                                        </tbody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>

                <h5 className="mb-4">Doctor Registration Approval Requests</h5>

                <Table bordered hover responsive>
                  <thead className="thead-dark">
                    <tr>
                      <th>Doctor Name</th>
                      <th>Doctor Email</th>
                      <th>Doctore ID</th>
                      
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalRequests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.doctor_id ? request.doctor_id.name : "Loading..."}</td>
                        <td>{request.doctor_id ? request.doctor_id.email : "Loading..."}</td>
                        
                        <td>{request.approval_status}</td>
                        <td>
                          {request.approval_status === "Pending" && (
                            <div>
                              <Button
                                variant="success"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleApprove(request._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleReject(request._id)}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Emergency Requests */}
      <h5 className="mb-4">Emergency Requests</h5>
      <Table bordered hover responsive>
        <thead className="thead-dark">
          <tr>
            <th>Patient Name</th>
            <th>Emergency Type</th>
            <th>Location</th>
            <th>Callback Number</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emergencyRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.name}</td>
              <td>{request.emergencyType}</td>
              <td>{request.location}</td>
              <td>{request.phoneNumber}</td>
              <td>{request.urgency}</td>
              <td>{request.status}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    setSelectedEmergency(request);
                    setNewStatus(request.status);
                    setShowModal(true);
                  }}
                >
                  Update Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
  {/* Modal for Updating Emergency Status */}
  <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Emergency Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="status">
              <Form.Label>Select New Status</Form.Label>
              <Form.Control as="select" value={newStatus} onChange={handleStatusChange}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateStatus}>Update Status</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
