import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/authSlice";
import { Button, Container } from "react-bootstrap";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);
  
    console.log(currentUser);
    if (!currentUser) {
        navigate('/login');
        return null;
    }

    // Logout handler
    const handleLogout = () => {
        dispatch(logout())  // Dispatch the logout action from the authSlice
            .then(() => {
                navigate('/login');  // Redirect to login after logout
            })
            .catch((error) => {
                console.error("Logout failed", error);  // Handle logout failure
            });
    };

    return (
        <Container>     
          <p>
            <strong>Email:</strong> {currentUser.user.email}
          </p>
          <strong>Roles:</strong>
          <ul>
            {currentUser.roles && currentUser.roles.map((role, index) => 
               <li key={index}>{role}</li>)}
          </ul>

          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Container>
      );    
};

export default Profile;