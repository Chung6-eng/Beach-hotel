import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../assets/CSS/Admin.css";

const Admin = () => {
  return (
    <section className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav className="admin-menu">
          <NavLink to="existing-rooms" className="admin-link">
            <i className="fa-solid fa-bed"></i> Manage Rooms
          </NavLink>

          <NavLink to="existing-bookings" className="admin-link">
            <i className="fa-solid fa-book"></i> Manage Bookings
          </NavLink>

          <NavLink to="revenue-stats" className="admin-link">
            <i className="fa-solid fa-chart-line"></i> Revenue Statistics
          </NavLink>

          <NavLink to="monthly-revenue" className="admin-link">
            <i className="fa-solid fa-receipt"></i> Monthly Revenue
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </section>
  );
};

export default Admin;
