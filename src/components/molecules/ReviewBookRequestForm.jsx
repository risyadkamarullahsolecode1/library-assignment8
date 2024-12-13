import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const ReviewBookRequestForm = ({ processId, onClose }) => {
  const [action, setAction] = useState("Approved"); // Default action is "Approved"
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission to review the request
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if a comment is provided (can be adjusted based on requirement)
    if (!comment) {
      setError("Please provide a comment.");
      return;
    }

    if (!processId) {
        return <Alert variant="danger">Invalid Process ID</Alert>;
      }
      
    try {
      setLoading(true);

      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

      // Call the backend API to submit the review
      const response = await axios.post("https://localhost:7064/api/BookRequest/review", {
        processId,
        action,
        comment
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });

      if (response.data.status === "Success") {
        // Close the modal after successful review
        onClose();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Review Book Request</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formAction">
          <Form.Label>Action</Form.Label>
          <Form.Control as="select" value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="Approved">Approve</option>
            <option value="Rejected">Reject</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formComment">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide any comments about the request"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </Form>
    </div>
  );
};

export default ReviewBookRequestForm;