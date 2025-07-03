import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Map,
  Package,
  UserCog,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Destinations", path: "/admindestinationlist", icon: <Map className="h-5 w-5" /> },
    { name: "Tour Packages", path: "/admintourpackages", icon: <Package className="h-5 w-5" /> },
    { name: "Bookings", path: "/bookingAdmin", icon: <Calendar className="h-5 w-5" /> },
    { name: "User List", path: "/userlist", icon: <Users className="h-5 w-5" /> },
    { name: "Guide List", path: "/guide", icon: <UserCog className="h-5 w-5" /> },
    { name: "Accommodations", path: "/addAccommodation", icon: <UserCog className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-green-700 text-white flex flex-col shadow-lg">

      {/* Logo */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-serif font-semibold text-white tracking-wide">
            YatriMap
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <div
            key={item.path}
            className="flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 bg-green-600/30 hover:bg-green-600/70 hover:shadow-inner"
            onClick={() => navigate(item.path)}
          >
            <div className="text-white">{item.icon}</div>
            <span className="ml-3 font-medium text-white">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-6 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-green-600/30 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
