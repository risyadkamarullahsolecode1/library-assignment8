import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, ListGroup } from "react-bootstrap";
import apiClient from "../../axiosConfig";

const BookRequestDetails = () => {
  const { processId } = useParams(); // Get processId from the URL
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch process details by processId
    apiClient
      .get(`/BookRequest/${processId}`)
      .then((response) => {
        setRequest(response.data); // Set request data to state
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load request details.");
        setLoading(false);
      });
  }, [processId]); // Re-run when processId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!request) return <div>Request not found</div>;

  return (
    <div>
      {request ? (
        <Card>
          <Card.Header as="h5">Request Details</Card.Header>
          <Card.Body>
            <Card.Title>Book Request</Card.Title>
            <Card.Text>
              <strong>Book Title:</strong> {request.bookTitle}
            </Card.Text>
            <Card.Text>
              <strong>Author:</strong> {request.author}
            </Card.Text>
            <Card.Text>
              <strong>Publisher:</strong> {request.publisher}
            </Card.Text>
            <Card.Text>
              <strong>Status:</strong> {request.status}
            </Card.Text>
            <Card.Text>
              <strong>Workflow Actions:</strong>
            </Card.Text>
            <ListGroup variant="flush">
              {request.workflowActions.map((action, index) => (
                <ListGroup.Item key={index}>
                  <strong>Action:</strong> {action.action} <br />
                  <strong>By:</strong> {action.actionBy} <br />
                  <strong>Date:</strong> {new Date(action.actionDate).toLocaleString()} <br />
                  <strong>Comments:</strong> {action.comments}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Button variant="primary" onClick={() => navigate('/bookrequest')}>
              Back to Request List
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <p>Request details are not available.</p>
      )}
    </div>
  );
};

export default BookRequestDetails;