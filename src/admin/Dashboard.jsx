import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Users, MapPin, ClipboardList, UserCheck, Calendar, CreditCard, Map } from "lucide-react";
import AdminNavbar from "./adminNavbar";

const AdminDashboard = () => {
  const [topDestinations, setTopDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [guides, setGuides] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, pendingBookings: 0 });

  useEffect(() => {
    axios.get(`/api/destination/section/TopDestination`)
      .then(res => setTopDestinations(res.data))
      .catch(err => console.error("Error fetching destinations:", err));
    
    axios.get("/api/user")
      .then(response => {
        // Filter out admin users
        const filteredUsers = response.data.filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);
      })
      .catch(err => console.error("Error fetching users:", err));
    
    axios.get("/api/booking")
      .then(res => {
        setBookings(res.data);
        // Calculate stats
        const totalRevenue = res.data.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const pending = res.data.filter(booking => booking.status === "pending").length;
        setStats({ revenue: totalRevenue, pendingBookings: pending });
      })
      .catch(err => console.error("Error fetching bookings:", err));
    
    axios.get("/api/guides")
      .then(res => setGuides(res.data))
      .catch(err => console.error("Error fetching guides:", err));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (AdminNavbar) */}
      <div className="w-64 bg-indigo-900 text-white fixed h-full">
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Total Users" 
            value={users.length} 
            icon={<Users size={24} className="text-indigo-600" />} 
            trend="+12% from last month"
            trendUp={true}
          />
          <DashboardCard 
            title="Total Bookings" 
            value={bookings.length} 
            icon={<ClipboardList size={24} className="text-green-600" />} 
            trend="+5% from last month"
            trendUp={true}
          />
          <DashboardCard 
            title="Total Revenue" 
            value={`$${stats.revenue.toFixed(2)}`} 
            icon={<CreditCard size={24} className="text-blue-600" />} 
            trend="+8% from last month"
            trendUp={true}
          />
          <DashboardCard 
            title="Pending Bookings" 
            value={stats.pendingBookings} 
            icon={<Calendar size={24} className="text-amber-600" />} 
            trend="-3% from last month"
            trendUp={false}
          />
        </div>

        {/* Destinations & Bookings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Destinations with images */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="mr-2 text-red-500" size={20} />
                Top Destinations
              </h2>
            </div>
            <div className="p-5 overflow-auto max-h-96">
              <div className="grid grid-cols-1 gap-4">
                {topDestinations.map((dest, index) => (
                  <div key={dest._id || index} className="flex border rounded-lg overflow-hidden">
                    <div className="w-1/3 h-32">
                      {dest.image ? (
                        <img 
                          src={`http://localhost:3000/destinations_image/${dest.image}`}
                          alt={dest.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Map size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 p-3">
                      <h3 className="font-semibold text-lg">{dest.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{dest.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {dest.category || "Adventure"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bookings with images */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <ClipboardList className="mr-2 text-green-500" size={20} />
                Bookings
              </h2>
            </div>
            <div className="p-5 overflow-auto max-h-96">
              {bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>No bookings available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div key={booking._id || index} className="flex border rounded-lg overflow-hidden">
                      <div className="w-1/3 h-32">
                        {booking.accommodationId && booking.accommodationId.image ? (
                          <img 
                            src={`http://localhost:3000/uploads/${booking.accommodationId.image}`}
                            alt={booking.accommodationId.title || "Accommodation"} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Map size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="w-2/3 p-3">
                        <h3 className="font-semibold">
                          {booking.destinationId?.title || booking.accommodationId?.title || "Unnamed Booking"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booked by: {booking.userId?.username || "Anonymous"}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-xs text-gray-500">
                              {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A"} - 
                              {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.guests || 1} guests
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium
                              ${getStatusClass(booking)}`}>
                              {getBookingStatus(booking)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-indigo-600 mt-1">
                          ${booking.totalPrice ? booking.totalPrice.toFixed(2) : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Users & Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardSection title="User List" icon={<Users size={18} className="text-blue-600" />}>
            <div className="overflow-auto max-h-64">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>No users available</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.slice(0, 10).map((user, index) => (
                      <tr key={user._id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${index % 3 === 0 ? 'bg-green-100 text-green-800' : index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Pending' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </DashboardSection>

          <DashboardSection title="Guide List" icon={<UserCheck size={18} className="text-orange-600" />}>
            <div className="overflow-auto max-h-64">
              {guides.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>No guides available</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guides.slice(0, 5).map((guide, index) => (
                      <tr key={guide._id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guide.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guide.specialty || "General"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guide.experience || "N/A"} {guide.experience ? "years" : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </DashboardSection>
        </div>

        <main className="mt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Helper functions for booking status
const getBookingStatus = (booking) => {
  if (booking.status) return booking.status;
  
  const today = new Date();
  const checkIn = booking.checkInDate ? new Date(booking.checkInDate) : null;
  const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate) : null;
  
  if (!checkIn || !checkOut) return "Incomplete";
  if (today < checkIn) return "Upcoming";
  if (today >= checkIn && today <= checkOut) return "Active";
  return "Completed";
};

const getStatusClass = (booking) => {
  const status = booking.status || getBookingStatus(booking);
  
  switch(status.toLowerCase()) {
    case "confirmed":
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
    case "upcoming":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const DashboardCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
    <div className="flex items-center mb-2">
      <div className="rounded-full bg-gray-100 p-3 mr-3">{icon}</div>
      <p className="text-gray-600 font-medium">{title}</p>
    </div>
    <p className="text-3xl font-bold mb-2">{value}</p>
    {trend && (
      <p className={`text-xs ${trendUp ? "text-green-600" : "text-red-600"}`}>
        {trend}
      </p>
    )}
  </div>
);

const DashboardSection = ({ title, children, icon }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-5 border-b flex items-center">
      {icon}
      <h2 className="text-xl font-semibold ml-2">{title}</h2>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

export default AdminDashboard;