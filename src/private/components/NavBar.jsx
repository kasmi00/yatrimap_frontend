import { Heart, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log("Navbar Rendered - isLoggedIn:", isLoggedIn, "UserId:", userId);
  }, [isLoggedIn, userId]);

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-black-300 font-semibold"
      : "text-white hover:text-black-200";

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#5C7678] shadow-sm">
      <div className="max-w-full mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold text-white font-serif">
            Yatrimap
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/destinations" className={navLinkClasses}>
              Destinations
            </NavLink>
            <NavLink to="/bookingList" className={navLinkClasses}>
              Bookings
            </NavLink>
            <NavLink to="/tourpackagelist" className={navLinkClasses}>
              Tour Packages
            </NavLink>

            <button
              className="text-white hover:text-black-200"
              onClick={() => navigate("/bucket-list")}
            >
              <Heart className="h-6 w-6" />
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-white flex items-center focus:outline-none"
                >
                  <User className="h-6 w-6" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 transition-all duration-200">
                    <button
                      onClick={() => {
                        navigate("/");
                        closeMenus();
                      }}
                      className="block px-4 py-2 text-gray-800 hover:bg-red-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-white px-4 py-2 rounded"
              >
                <User className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#5C7678] rounded-lg p-4 mt-2 space-y-4">
            <NavLink to="/destinations" className={navLinkClasses} onClick={closeMenus}>
              Destinations
            </NavLink>
            <NavLink to="/bookingList" className={navLinkClasses} onClick={closeMenus}>
              Bookings
            </NavLink>
            <NavLink to="/tourpackagelist" className={navLinkClasses} onClick={closeMenus}>
              Tour Packages
            </NavLink>
            <button
              onClick={() => {
                navigate("/bucket-list");
                closeMenus();
              }}
              className="flex items-center text-white hover:text-black-200"
            >
              <Heart className="h-5 w-5 mr-2" />
              Bucket List
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  navigate("/");
                  closeMenus();
                }}
                className="w-full text-left text-white hover:text-red-200"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  closeMenus();
                }}
                className="flex items-center text-white hover:text-black-200"
              >
                <User className="h-5 w-5 mr-2" />
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
