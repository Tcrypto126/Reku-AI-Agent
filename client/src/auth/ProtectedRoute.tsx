import React, { JSX } from 'react';  
import { Navigate } from 'react-router-dom';  
import { useAuth } from './AuthContext'; // Adjust the import according to your file structure  

interface ProtectedRouteProps {  
  element: JSX.Element;  // Define the props for the component  
}  

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {  
  const { isAuthenticated, loading } = useAuth();  

  if (loading) {  
    return <div>Loading...</div>; // Show loading while checking auth status  
  }  

  return isAuthenticated ? element : <Navigate to="/" replace />; // Redirect to login if not authenticated  
};  

export default ProtectedRoute;  