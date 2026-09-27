import React from "react";

import "./confirmModal.css";

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) {

  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-overlay"
      onClick={onCancel}
    >

      <div
        className="confirm-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="confirm-icon">
          ⚠️
        </div>

        <h2>
          {title}
        </h2>

        <p>
          {message}
        </p>

        <div className="confirm-actions">

          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="confirm-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;