import React from "react";
import { useNavigate } from "react-router-dom";
import "./backbutton.css";

function BackButton({ fallback = "/dashboard" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button className="back-button" onClick={handleBack}>
      <span className="back-arrow">←</span>
      <span>Back</span>
    </button>
  );
}

export default BackButton;