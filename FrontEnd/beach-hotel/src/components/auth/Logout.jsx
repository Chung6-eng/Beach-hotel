import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/", { state: { message: "You have been logged out!" } });
  };

  return (
    <button className="dropdown-item" onClick={onLogout}>
      Logout
    </button>
  );
};

export default Logout;
