import React from "react";
import AuthToggle from "./Auth"

const LoginModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close login modal"
          >
            ✕
          </button>
        </div>
        <AuthToggle />
      </div>
    </div>
  );
};

export default LoginModal;