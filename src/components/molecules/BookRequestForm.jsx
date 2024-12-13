import React, { useState } from 'react';
import { Form, Container, Alert, Spinner, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const BookRequestForm = () => {
    const [formData, setFormData] = useState({
        requestName: '',
        description: '',
        bookTitle: '',  
        author: '',
        publisher: '',
        comment: '',
    });

    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    
    // Handle changes
    const handleInputChanges = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage(null);
        setResponseStatus(null);

        try {
            // Retrieve the token from localStorage (ensure the user is authenticated)
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

            // Send the token in the Authorization header if available
            const response = await axios.post("https://localhost:7064/api/BookRequest/submit", formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });

            setResponseStatus(response.data.status);
            setResponseMessage(response.data.message);
            setFormData({
                requestName: '',
                description: '',
                bookTitle: '',  
                author: '',
                publisher: '',
                comment: '',
            });
        } catch (error) {
            setResponseStatus("Error");
            setResponseMessage(error.response?.data?.message || "An error occurred while submitting the request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <h2 className="text-center mx-auto">Submit Book Request</h2>
            {responseMessage && (
            <Alert variant={responseStatus === "Success" ? "success" : "danger"}>{responseMessage}</Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Request Name</Form.Label>
                    <Form.Control
                    type="text"
                    name="requestName"
                    value={formData.requestName}
                    onChange={handleInputChanges}
                    placeholder="Enter request name"
                    required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChanges}
                    placeholder="Enter description"
                    required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Book Title</Form.Label>
                    <Form.Control
                    type="text"
                    name="bookTitle"
                    value={formData.bookTitle}
                    onChange={handleInputChanges}
                    placeholder="Enter book Title"
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChanges}
                    placeholder="Enter author"
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Publisher</Form.Label>
                    <Form.Control
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChanges}
                    placeholder="Enter publisher"
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                    type="text"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChanges}
                    placeholder="Enter comments"
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Submitting...
                        </>
                    ) : (
                        "Submit Request"
                    )}
                </Button>
            </Form>
        </Container>
    );
}

export default BookRequestForm;