import React from "react";
import { Modal, Button } from "react-bootstrap";

const CancelAppointment = ({ show, onClose, onConfirm }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="text-center">
        <h4 className="mb-3">Cancel Appointment</h4>
        <p>Are you sure you want to cancel the appointment with Dr. [Name] on [Date] at [Time]?</p>
        <div className="d-flex justify-content-around mt-3">
          <Button variant="success" size="lg" onClick={onConfirm}>Yes</Button>
          <Button variant="danger" size="lg" onClick={onClose}>No</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CancelAppointment;
