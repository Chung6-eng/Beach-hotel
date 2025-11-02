import React from "react";
import { Link } from "react-router-dom";
import "../../assets/CSS/Admin.css"; 
import { NavLink } from "react-router-dom";

const Admin = () => {
  return (
    <section className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav className="admin-menu">
  <NavLink to="/existing-rooms" className="admin-link">
  <i className="fa-solid fa-bed"></i>
  Manage Rooms
</NavLink>

  <Link to="/existing-bookings" className="admin-link">
    <i className="fa-solid fa-book"></i>
    Manage Bookings
  </Link>
</nav>

      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h2>Welcome to Admin Panel</h2>
        <hr />
        <p>Select an option from the left panel</p>
      </main>
    </section>
  );
};

export default Admin;
