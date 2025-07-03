import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; 
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 'user',
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const images = [
    "/src/images/firstimg.png",
    "/src/images/loginimg.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setPasswordMatch(
      data.password === data.confirmPassword || data.confirmPassword === ""
    );
  }, [data.password, data.confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", data);
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Section */}
      <div className="w-1/2 p-12 flex flex-col justify-center relative">
        <h1 className="text-3xl font-inriaSans font-medium text-center text-black mb-2">
          Adventure awaits, just one click away with VoyageVue
        </h1>
        <div className="mt-8 flex justify-center">
          <img
            src={images[currentImage]}
            className="w-3/4 h-auto object-contain transition-opacity duration-1000"
            alt="Travel illustration"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-12 border-2 border-black">
          <h2 className="text-3xl font-inriaSans mb-6 text-center">Register</h2>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-inter regular text-gray-600">Username</label>
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent rounded-lg border-2 border-gray-300 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-inter regular text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent rounded-lg border-2 border-gray-300 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-inter regular text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-transparent rounded-lg border-2 border-gray-300 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-inter regular text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-transparent rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-500 ${
                  !passwordMatch && data.confirmPassword
                    ? "border-red-500"
                    : "border-gray-400"
                }`}
                required
              />
              {!passwordMatch && data.confirmPassword && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordMatch}
              className="w-full py-3 mt-6 bg-[#0F172A] text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#0F172A]"
            >
              {loading ? "Loading..." : "Register"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#0F172A] hover:text-blue-800 hover:underline font-medium"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
