import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {  register, reset } from '../../slices/authSlice';
import { Button, Card, Container, Form, Row, Col, Alert } from 'react-bootstrap';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        libraryCardNumber: '',
        libraryCardExpDate: '',
        position: '',
        previlege: '',
      });
    const { firstName, lastName, email, password,  libraryCardNumber, libraryCardExpDate, position, previlege} = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
      );
    
      useEffect(() => {    
        if (isError) {
          alert(message);
        }
    
        if (isSuccess || user) {      
          navigate('/login'); 
        }
        
        dispatch(reset());
      }, [user, isError, isSuccess, message, navigate, dispatch]);
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        console.log("Registering with data: ", formData);  // Check the payload
        dispatch(register(formData));
    };
    
    if (isLoading) {
        return (
          <div> <span>Loading...</span> </div>
        );
    }

    return (
        <Container>
            <Card.Title className="text-center text-white">Register</Card.Title>
            <Form onSubmit={onSubmit}>
            <Col>
              <Row className="mb-4">
                <Form.Label htmlFor="firstName">First Name</Form.Label>
                <Form.Control 
                    type="text" 
                    id="firstName" name="firstName"
                    value={firstName} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter first Name"
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="lastName">Last Name</Form.Label>
                <Form.Control 
                    type="text"  
                    id="lastName" name="lastName"
                    value={lastName} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter lastName"
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control 
                    type="email"  
                    id="email" name="email"
                    value={email} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter email"
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control 
                    type="password" 
                    className="form-control" 
                    id="password" name="password"
                    value={password} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter password" 
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="libraryCardNumber" >Library Card Number</Form.Label>
                <Form.Control 
                    type="number" 
                    className="form-control" 
                    id="libraryCardNumber" name="libraryCardNumber"
                    value={libraryCardNumber} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter library Card Number" 
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="libraryCardExpDate" >Library Card Exp Date</Form.Label>
                <Form.Control 
                    type="date" 
                    className="form-control" 
                    id="libraryCardExpDate" name="libraryCardExpDate"
                    value={libraryCardExpDate} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter library Card Exp Date" 
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="position" >Position</Form.Label>
                <Form.Control 
                    type="text" 
                    className="form-control" 
                    id="position" name="position"
                    value={position} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter position" 
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="previlege" >Previlege</Form.Label>
                <Form.Control 
                    type="text" 
                    className="form-control" 
                    id="previlege" name="previlege"
                    value={previlege} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter previlege" 
                />
              </Row>
              <Row className="d-grid">
                <Button type="submit" className="btn btn-primary" disabled={isLoading} >
                  {isLoading ? 'Register...' : 'Registered'}
                </Button>
              </Row>
            </Col>
            </Form>         
            {message && (
            <Form.Group>
              <Alert className="alert alert-danger" role="alert">
                {message}
              </Alert>
            </Form.Group>
          )} 
        </Container>
    )
};

export default Register;