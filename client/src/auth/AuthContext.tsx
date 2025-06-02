import React, { createContext, useContext, useState, useEffect } from 'react';  

// Define a shape for the context state  
interface AuthContextType {  
  isAuthenticated: boolean;  
  loading: boolean;  
  login: (token: string) => void;  
  logout: () => void;
}  

// Create a context with a default value  
const AuthContext = createContext<AuthContextType | undefined>(undefined);  

// Create a provider component  
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const [isAuthenticated, setIsAuthenticated] = useState(false);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    const token = localStorage.getItem('walletToken');
    setIsAuthenticated(!!token); // Set authentication status based on token presence  
    setLoading(false);  
  }, []);  

  const login = (token: string) => {  
    localStorage.setItem('walletToken', token);  
    setIsAuthenticated(true);  
  };  

  const logout = () => {  
    localStorage.removeItem('walletToken');  
    setIsAuthenticated(false);  
  };  

  return (  
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>  
      {children}  
    </AuthContext.Provider>  
  );  
};  

// Custom hook to use the AuthContext  
export const useAuth = (): AuthContextType => {  
  const context = useContext(AuthContext);  
  if (!context) {  
    throw new Error("useAuth must be used within an AuthProvider");  
  }  
  return context;  
};  