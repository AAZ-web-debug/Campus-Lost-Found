import React, {
  createContext,
  useContext,
  useState,
  useCallback
} from "react";

import "./toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {

  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    ({
      type = "success",
      title,
      message,
      duration = 3500
    }) => {

      setToast({
        type,
        title,
        message
      });

      setTimeout(() => {
        setToast(null);
      }, duration);
    },
    []
  );

  const success = useCallback(
    (message, title = "Success") => {
      showToast({
        type: "success",
        title,
        message
      });
    },
    [showToast]
  );

  const error = useCallback(
    (message, title = "Something went wrong") => {
      showToast({
        type: "error",
        title,
        message
      });
    },
    [showToast]
  );

  const warning = useCallback(
    (message, title = "Please check") => {
      showToast({
        type: "warning",
        title,
        message
      });
    },
    [showToast]
  );

  const info = useCallback(
    (message, title = "Information") => {
      showToast({
        type: "info",
        title,
        message
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        warning,
        info
      }}
    >
      {children}

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
        >
          <div className="toast-icon">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "!"}
            {toast.type === "warning" && "!"}
            {toast.type === "info" && "i"}
          </div>

          <div className="toast-content">
            <strong>
              {toast.title}
            </strong>

            <span>
              {toast.message}
            </span>
          </div>

          <button
            className="toast-close"
            onClick={() =>
              setToast(null)
            }
          >
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}