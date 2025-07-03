import axios from "axios";
import { Calendar, Loader2, MapPin, User, DollarSign, ChevronDown, ChevronUp, Filter, Search, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import AdminNavbar from "./adminNavbar";

const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/booking/");
      setBookings(response.data);
    } catch (err) {
      setError("Failed to fetch bookings.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  const filteredBookings = bookings
    .filter((booking) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const accommodationMatch = booking.accommodationId?.title?.toLowerCase().includes(searchLower) || false;
      const destinationMatch = booking.destinationId?.title?.toLowerCase().includes(searchLower) || false;
      const guideMatch = booking.guideId?.name?.toLowerCase().includes(searchLower) || false;
      
      if (searchTerm && !(accommodationMatch || destinationMatch || guideMatch)) {
        return false;
      }
      
      // Status filter
      if (filterStatus !== "all") {
        // This is a placeholder - you'd need to implement actual status logic
        // based on your booking model
        return true;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === "date") {
        const dateA = new Date(a.checkInDate || 0);
        const dateB = new Date(b.checkInDate || 0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "price") {
        const priceA = a.totalPrice || 0;
        const priceB = b.totalPrice || 0;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      }
      return 0;
    });

  const getStatusBadge = (booking) => {
    // This is a placeholder - implement based on your actual booking status logic
    const today = new Date();
    const checkIn = booking.checkInDate ? new Date(booking.checkInDate) : null;
    const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate) : null;
    
    if (!checkIn || !checkOut) return (
      <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800">
        Incomplete
      </span>
    );
    
    if (today < checkIn) return (
      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
        Upcoming
      </span>
    );
    
    if (today >= checkIn && today <= checkOut) return (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        Active
      </span>
    );
    
    return (
      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
        Completed
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 shadow-md">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-center text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-8 shadow-md">
          <div className="text-center text-red-500">{error}</div>
          <button 
            onClick={handleRefresh}
            className="mt-4 flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex-1 p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">View and manage all travel bookings</p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Active Bookings</p>
            <p className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => {
                const today = new Date();
                const checkIn = b.checkInDate ? new Date(b.checkInDate) : null;
                const checkOut = b.checkOutDate ? new Date(b.checkOutDate) : null;
                return checkIn && checkOut && today >= checkIn && today <= checkOut;
              }).length}
            </p>
          </div>
          
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Upcoming Bookings</p>
            <p className="text-2xl font-bold text-green-600">
              {bookings.filter(b => {
                const today = new Date();
                const checkIn = b.checkInDate ? new Date(b.checkInDate) : null;
                return checkIn && today < checkIn;
              }).length}
            </p>
          </div>
          
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              ${bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="mb-6 flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              <select
                className="rounded-md border border-gray-300 py-2 pl-2 pr-8 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="inline-flex items-center">
              <select
                className="rounded-md border border-gray-300 py-2 pl-2 pr-8 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Earliest First</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow-sm">
            <Calendar className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm 
                ? "Try adjusting your search or filters" 
                : "New bookings will appear here when they're made"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div 
                  className="flex flex-col cursor-pointer p-4 sm:flex-row sm:items-center"
                  onClick={() => setSelectedBooking(selectedBooking === booking._id ? null : booking._id)}
                >
                  {/* Image Column */}
                  <div className="mb-4 h-40 w-full overflow-hidden rounded-lg sm:mb-0 sm:h-24 sm:w-24 sm:flex-shrink-0">
                    <img
                      src={
                        booking.accommodationId?.image
                          ? `http://localhost:3000/uploads/${booking.accommodationId.image}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={booking.accommodationId?.title || "Accommodation"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Main Info */}
                  <div className="ml-0 flex-1 sm:ml-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {booking.accommodationId?.title || "Unknown Accommodation"}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(booking)}
                        {selectedBooking === booking._id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {/* Date */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4 flex-shrink-0" />
                        <span>
                          {booking.checkInDate
                            ? new Date(booking.checkInDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}{" "}
                          →{" "}
                          {booking.checkOutDate
                            ? new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{booking.destinationId?.title || "N/A"}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="mr-1 h-4 w-4 flex-shrink-0" />
                        <span>{booking.totalPrice ? booking.totalPrice.toFixed(2) : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedBooking === booking._id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <h4 className="text-xs font-medium uppercase text-gray-500">Booking Details</h4>
                        <p className="mt-1 text-sm text-gray-900">ID: {booking._id}</p>
                        <p className="text-sm text-gray-900">
                          Created: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium uppercase text-gray-500">Guest Information</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          <User className="mr-1 inline h-4 w-4" />
                          {booking.userId?.username || "N/A"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium uppercase text-gray-500">Tour Guide</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          {booking.guideId?.name || "No guide assigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingList;