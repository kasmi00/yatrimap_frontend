import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/NavBar';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    email: '',
  });

  const forgetPassword = async (e) => {
    e.preventDefault();
    const { email } = data;

    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgetpassword', {
        email,
      });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        navigate(`/Resetpassword/${email}`);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h4 className="text-2xl font-semibold text-center mb-4">Forgot Password</h4>
          {/* Display error message if there's any */}
          {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
          <form onSubmit={forgetPassword}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;