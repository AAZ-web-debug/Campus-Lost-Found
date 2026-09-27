import React, { useState } from "react";
import "./approveClaimModal.css";

function ApproveClaimModal({
  open,
  onConfirm,
  onCancel,
  loading = false
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanEmail && !cleanPhone) {
      setError(
        "Please provide an email address or phone number."
      );
      return;
    }

    onConfirm({
      email: cleanEmail || null,
      phone: cleanPhone || null
    });
  };

  return (
    <div className="approve-modal-overlay">
      <div className="approve-modal">

        <div className="approve-modal-icon">
          ✓
        </div>

        <h2>
          Approve Claim
        </h2>

        <p className="approve-modal-description">
          Share your contact details with the
          claimant so they can contact you to
          arrange the handover.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="contact-field">
            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
            />
          </div>

          <div className="contact-field">
            <label>
              Phone
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          {error && (
            <p className="approve-modal-error">
              {error}
            </p>
          )}

          <p className="approve-modal-note">
            At least one contact method is required.
            These details will only be visible to
            the approved claimant.
          </p>

          <div className="approve-modal-actions">

            <button
              type="button"
              className="approve-cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="approve-confirm-btn"
              disabled={loading}
            >
              {loading
                ? "Approving..."
                : "Approve & Share"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default ApproveClaimModal;