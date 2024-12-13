import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Container, Button, Modal } from "react-bootstrap";
import axios from "axios";
import ReviewBookRequestForm from "../molecules/ReviewBookRequestForm";
import { Link } from "react-router-dom";

const BookRequestList = () => {
  const [bookRequests, setBookRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProcessId, setSelectedProcessId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch book requests on component mount
  useEffect(() => {
    const fetchBookRequests = async () => {
      try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        const response = await axios.get("https://localhost:7064/api/BookRequest/status", {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        setBookRequests(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized: Please log in to access book requests.");
        } else {
          console.error("Error fetching book requests:", err);
          setError("Failed to fetch book requests. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookRequests();
  }, []);

  const handleReviewClick = (processId) => {
    console.log("Selected processId:", processId);  // Add this log to check if processId is set
    setSelectedProcessId(processId); // Set the selected Process ID
    setShowReviewModal(true); // Show the modal for review
  };

  const handleCloseModal = () => {
    setShowReviewModal(false); // Close the modal
    setSelectedProcessId(null); // Reset selected Process ID
    console.log("Closing modal...");
    setShowReviewModal(false); // Close the modal
    setSelectedProcessId(null); // Reset selected Process ID
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Spinner animation="border" variant="primary" />
        <span className="ml-2">Loading book requests...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Book Request List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Book Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>Status</th>
            <th>Step</th>
            <th>Requester</th>
            <th>Process</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookRequests.map((request) => (
            <tr key={request.RequestId}>
              <td>{request.requestId}</td>
              <td>{request.bookTitle}</td>
              <td>{request.author}</td>
              <td>{request.publisher}</td>
              <td>{request.status}</td>
              <td>{request.currentStep}</td>
              <td>{request.applicantName}</td>
              <td>{request.processId}</td>
              <td>
                <Button variant="warning" onClick={() => handleReviewClick(request.processId)}>
                  Review
                </Button>
                <Link to={`/bookrequest/${request.processId}`}>
                    <Button variant="primary">
                    Details
                    </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Review Book Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedProcessId ? (
            <ReviewBookRequestForm processId={selectedProcessId} onClose={handleCloseModal} />
            ) : (
            <Alert variant="danger">No process selected!</Alert>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
            Close
            </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookRequestList;