import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import "./navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="main-navbar">

      <div
        className="nav-logo"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        🛡️ Campus Lost & Found
      </div>

      <div className="nav-links">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            navigate("/finder")
          }
        >
          Report Item
        </button>

        <button
          onClick={() =>
            navigate("/loser")
          }
        >
          Browse Items
        </button>

        <button
          onClick={() =>
            navigate("/review-claims")
          }
        >
          Review Claims
        </button>

        <button
          className="logout-nav"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;