import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";


const NavBar = props => {
  let menu = (
        <div id="navbar-menu" className="navbar-menu is-static">

          <div className="navbar-start">

          </div>

          <div className="navbar-end">
            <Link to="/" className="navbar-item nav-title">
              Home
            </Link>
            <Link to="/about" className="navbar-item" data-testid="nav-about">
              About
            </Link>

            <a href="#" class="navbar-item is-secondary modal-trigger" data-modal="auth-modal">
              Log in
            </a>

            <Link to="/register" className="navbar-item" data-testid="nav-register">
              Register
            </Link>
            <Link to="/login" className="navbar-item" data-testid="nav-login">
              Log In
            </Link>

          </div>
        </div>

  );
  if (props.isAuthenticated()) {
    menu = (

          <div id="navbar-menu" className="navbar-menu is-static">

            <div className="navbar-start">

            </div>

            <div className="navbar-end">
              <Link to="/" className="navbar-item nav-title">
                Home
              </Link>
              <Link to="/about" className="navbar-item" data-testid="nav-about">
                About
              </Link>
              <Link to="/status" className="navbar-item" data-testid="nav-status">
                User Status
              </Link>
              <span
                onClick={props.logoutUser}
                className="navbar-item link"
                data-testid="nav-logout"
              >
                Log Out
              </span>

            </div>
          </div>

    );
  }
  return (

  <nav
    className="navbar is-fresh is-transparent no-shadow"
    role="navigation"
    aria-label="main navigation"
  >


    <section className="container">



      <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>




      {menu}
    </section>


  </nav>
  );
};

NavBar.propTypes = {

  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default NavBar;
