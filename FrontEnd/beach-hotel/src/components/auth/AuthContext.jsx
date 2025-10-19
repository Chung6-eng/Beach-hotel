import React, { createContext, useState, useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";

// Tạo AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Khi load trang, check token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwt_decode(token);
        setUser(decodedUser);
      } catch (err) {
        console.error("Invalid token:", err);
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (token) => {
    const decodedUser = jwt_decode(token);
    localStorage.setItem("userId", decodedUser.sub);
    localStorage.setItem("userRole", decodedUser.roles);
    localStorage.setItem("token", token);
    setUser(decodedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
