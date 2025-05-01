import React from "react";
import { useNavigate } from "react-router-dom";

const WrongPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-sm w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-6">
          It seems like the page you're looking for doesn't exist. Please check the URL or go back to the home page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default WrongPage;
