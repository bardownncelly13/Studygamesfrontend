
import React from "react";
import { useAuth } from "../context/Authcontext";

const LoginButton = ({ onLoginClick }) => {
  const { user, logout } = useAuth();

  return !user ? (
    <button
      onClick={onLoginClick}
      className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold px-3 py-1 rounded-full shadow-md hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
    >
      Login
    </button>
  ) : (
    <button
      onClick={() => logout()}
      className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold px-3 py-1 rounded-full shadow-md hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
    >
      Logout
    </button>
  );
};

export default LoginButton;
