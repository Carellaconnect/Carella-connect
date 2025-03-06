import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './Navigation';
import { Table, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);

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

  // Handle approve action
  const handleApprove = (requestId) => {
    fetch(`http://localhost:5000/update-doctor-approval/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),  // Sending status as Approved
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
        }
      })
      .catch((error) => console.error("Error approving doctor:", error));
  };

  // Handle reject action
  const handleReject = (requestId) => {
    fetch(`http://localhost:5000/update-doctor-approval/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),  // Sending status as Rejected
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
        }
      })
      .catch((error) => console.error("Error rejecting doctor:", error));
  };

  return (
    <>
      <Navigation />
    
                <h3 className="text-center mb-4">Admin Dashboard</h3>
                <p className="text-center mb-4">Welcome to Admin Page</p>

                <h5 className="mb-4">Doctor Registration Approval Requests</h5>

                <Table bordered hover responsive>
                  <thead className="thead-dark">
                    <tr>
                      <th>Doctor Name</th>
                      <th>Doctor Email</th>
                      <th>Status</th>
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
  
    </>
  );
};

export default AdminDashboard;
