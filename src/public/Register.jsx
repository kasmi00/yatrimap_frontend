import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const images = [
    "/src/images/firstimg.png",
    "/src/images/loginimg.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      console.error("Registration error:", error);
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
      {/* Left - Image + Slogan */}
      <div className="w-1/2 p-12 flex flex-col justify-center text-black">
        <h1 className="text-3xl font-inriaSans font-semibold text-center mb-6">
          Adventure awaits — just one click away with Yatrimap
        </h1>
        <div className="mt-4 flex justify-center">
          <img
            src={images[currentImage]}
            className="w-3/4 h-auto object-contain transition-opacity duration-1000"
            alt="Register Illustration"
          />
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-1/2 flex items-center justify-center p-16">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-gray-300 shadow-xl">
          <h2 className="text-3xl font-inriaSans font-semibold text-center text-black mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${!passwordMatch && data.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-green-600"
                  }`}
                required
              />
              {!passwordMatch && data.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !passwordMatch}
              className="w-full py-3 mt-4 bg-black text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Login Redirect */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-black hover:text-blue-800 hover:underline font-medium"
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
