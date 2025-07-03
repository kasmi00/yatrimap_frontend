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
    { name: "Accomodations", path: "/addAccommodation", icon: <UserCog className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-green/70 text-white flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-white/50">
        <div className="flex items-center justify-center">
          <h1 className="ml-2 font-serif text-2xl font-medium text-white">YatriMap</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-1 flex-1">
        {navItems.map((item) => (
          <div
            key={item.path}
            className="flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-green-800"
            onClick={() => navigate(item.path)}
          >
            <div className="text-green-300">{item.icon}</div>
            <span className="ml-3 font-medium">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-6 w-full">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-green-800 hover:text-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;