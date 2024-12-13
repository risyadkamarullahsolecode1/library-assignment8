import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/templates/Header';
import Footer from './components/templates/Footer';

const PrivateRoute = ({allowedRoles}) => {  
  const { user } = useSelector(state => state.auth);
  
  const hasRequiredRole = () => {    
    if (!allowedRoles) return true;    
   
    return user?.roles?.some(role => 
      allowedRoles.includes(role)
    ) || false;
  };

   
    if (allowedRoles && !hasRequiredRole()) {
    // Redirect ke halaman unauthorized jika role tidak sesuai
    return <Navigate to="/unauthorized" />;
  }
 

  return user ? 
   <div className="container">    
      <Header />   
      <Outlet />   
      <Footer/>      
    </div> 
    : <Navigate to="/login" replace />;
};

export default PrivateRoute;