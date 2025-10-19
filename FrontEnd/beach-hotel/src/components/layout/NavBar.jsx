import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const NavBar = () => {
    const [showAccount,setShowAccount] = useState(false)

    const handleAccountClick = ()=>{
        setShowAccount(!showAccount)
    }
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow sticky-top ">
      <div className='container-fluid '>
        <Link to={"/"} className="navbar-brand hotel-color fw-bold">
          Beach Hotel
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarScroll'
          aria-controls='navbarScroll'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* Menu items */}
        <div className='collapse navbar-collapse' id='navbarScroll'>
          {/* Left side */}
          <ul className='navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll'>
            <li className='nav-item'>
              <NavLink className="nav-link" aria-current="page" to="/browse-all-rooms">
                Browse all rooms
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className="nav-link" aria-current="page" to="/admin">
                Admin
              </NavLink>
            </li>
          </ul>

          {/* Right side */}
          <ul className='navbar-nav d-flex'>
            <li className='nav-item'>
                  <NavLink className='nav-link' to={"/find-booking"}>
                Find my booking
              </NavLink>
            </li>

            {/* Dropdown */}
            <li className='nav-item dropdown'>
              <a
                className={` nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                href='/#'
                id='navbarDropdown'
                role='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                onClick={handleAccountClick}
              >
                {" "}
                Account
              </a>
              <ul className='dropdown-menu dropdown-menu-end' aria-labelledby='navbarDropdown'>
                <li>
                  <Link to="/login" className='dropdown-item'>Login</Link>
                </li>
                <li>
                  <Link to="/profile" className='dropdown-item'>Profile</Link>
                </li>
                <hr />
                <li>
                  <Link to="/logout" className='dropdown-item'>Logout</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
