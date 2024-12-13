import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector(state => state.auth);

  // Menu items definition
  const menuItems = [
    { 
      label: 'Home Page', path: '/', visibleForAll: true 
    },
    { 
      label: 'Dashboard', path: '/dashboard', visibleForRoles: ['Library Manager', 'Librarian']  
    },    
    { 
      label: 'Book Report', path: '/book-report', visibleForRoles: ['Library Manager', 'Librarian'] 
    },       
    { 
      label: 'User Report', path: '/user-report', visibleForRoles: ['Library Manager'] 
    },       
    { 
      label: 'Profil', path: '/profile', 
      visibleForRoles: ['Librarian', 'Library Manager', 'Library User'] 
    },
    { 
      label: 'Daftar Buku', path: '/books', visibleForRoles: ['Librarian'] 
    },
    { 
      label: 'Members', path: '/members', visibleForRoles: ['Library Manager'] 
    },
    { 
      label: 'Login', path: '/login', isAuthenticated: false 
    },
    { 
      label: 'Register', path: '/register', isAuthenticated: false 
    },
    { 
      label: 'Logout'
    },
  ];

  // Check if the menu item should be visible
  const isMenuVisible = (item) => {
    // Always show menu for all users
    if (item.visibleForAll) return true;

    // If user is not logged in, show menus with isAuthenticated: false
    if (item.isAuthenticated === false && !currentUser) {
      return true;
    }

    // If user is logged in, show the logout option
    if (item.label === 'Logout' && currentUser) {
      return true;
    }

    // Check role-specific menus
    if (item.visibleForRoles && currentUser?.roles) {
      return item.visibleForRoles.some(role => 
        currentUser.roles.includes(role)
      );
    }

    return false;
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Redirect to the home page after logging out
  };

  return (
    <header>  
      <Navbar expand="lg" bg="primary" data-bs-theme="dark" sticky="top" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#">Library App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {menuItems.filter(isMenuVisible).map((item, index) => (       
              <Nav.Link key={index} href={item.path}
                onClick={item.label === 'Logout' ? handleLogout : null}>
                {item.label}
              </Nav.Link> 
            ))}
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {currentUser && (
        <h6>
          Welcome, <strong>{currentUser.user.userName}</strong>
        </h6>
      )}
    </header>
  );
};

export default Header;