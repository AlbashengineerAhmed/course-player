import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * ToastManager component that provides toast notifications for the application
 * @returns {JSX.Element} The rendered component
 */
const ToastManager = () => {
  // Listen for custom toast events
  useEffect(() => {
    const handleWarningToast = (e) => {
      toast.warning(e.detail.message);
    };

    const handleSuccessToast = (e) => {
      toast.success(e.detail.message);
    };

    const handleErrorToast = (e) => {
      toast.error(e.detail.message);
    };

    const handleInfoToast = (e) => {
      toast.info(e.detail.message);
    };

    // Add event listeners
    window.addEventListener("showWarningToast", handleWarningToast);
    window.addEventListener("showSuccessToast", handleSuccessToast);
    window.addEventListener("showErrorToast", handleErrorToast);
    window.addEventListener("showInfoToast", handleInfoToast);

    // Clean up
    return () => {
      window.removeEventListener("showWarningToast", handleWarningToast);
      window.removeEventListener("showSuccessToast", handleSuccessToast);
      window.removeEventListener("showErrorToast", handleErrorToast);
      window.removeEventListener("showInfoToast", handleInfoToast);
    };
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

// Export toast functions for easy access
export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const showInfoToast = (message) => {
  toast.info(message);
};

export const showWarningToast = (message) => {
  toast.warning(message);
};

export default ToastManager;
