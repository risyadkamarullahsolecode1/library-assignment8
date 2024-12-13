import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../../slices/authSlice';
import { Button, Card, Container, Form, Row, Col, Alert } from 'react-bootstrap';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
      });
    const { username, password } = formData;

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
          navigate('/profile'); 
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
        dispatch(login(formData));
    };
    
    if (isLoading) {
        return (
          <div> <span>Loading...</span> </div>
        );
    }

    return (
        <Container>     
          <Card.Title className="text-center text-white">Login</Card.Title>
            <Form onSubmit={onSubmit}>
            <Col>
              <Row className="mb-4">
                <Form.Label htmlFor="username" className="form-label">Username</Form.Label>
                <Form.Control 
                    type="text" 
                    className="form-control" 
                    id="username" name="username"
                    value={username} 
                    onChange={onChange} 
                    required 
                    placeholder="Enter username"
                />
              </Row>
              <Row className="mb-4">
                <Form.Label htmlFor="password" className="form-label">Password</Form.Label>
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
              <Row className="d-grid">
                <Button type="submit" className="btn btn-primary" disabled={isLoading} >
                  {isLoading ? 'Logging in...' : 'Login'}
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
      );     
};

export default Login