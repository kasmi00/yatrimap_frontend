import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { Trash2, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, CreditCard } from "lucide-react";

const BookingList = () => {
  const navigate = useNavigate();
  const { userId, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing. Unable to fetch bookings.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found. Redirecting to login.");
          return;
        }

        const response = await axios.get(`/api/booking/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Failed to fetch bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  // Function to format date like "February 23, 2025"
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to calculate duration between two dates
  const calculateDuration = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Delete booking function
  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found. Redirecting to login.");
        return;
      }

      await axios.delete(`/api/booking/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted booking from the state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      
      // Use a more elegant notification instead of alert
      const notification = document.createElement("div");
      notification.className = "fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg";
      notification.textContent = "Booking cancelled successfully";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
    } catch (err) {
      console.error(err);
      const notification = document.createElement("div");
      notification.className = "fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg";
      notification.textContent = "Failed to cancel booking. Please try again.";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  const changeMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    
    const today = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const isCurrentMonth = currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear;

    // Parse the booked check-in and check-out dates
    const bookedDates = bookings.reduce((acc, booking) => {
      const checkInDate = new Date(booking.checkInDate);
      const checkOutDate = new Date(booking.checkOutDate);
      
      // Only consider dates in the current month/year being displayed
      if (checkInDate.getMonth() === currentDate.getMonth() && 
          checkInDate.getFullYear() === currentDate.getFullYear()) {
        
        const checkIn = checkInDate.getDate();
        const checkOut = checkOutDate.getDate();
        
        for (let i = checkIn; i <= checkOut; i++) {
          acc.push(i);
        }
      }
      return acc;
    }, []);

    let calendarDays = [];

    // Add empty spaces for days before the first day of the month
    // Adjust for Sunday as 0 to Monday as 0
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="text-gray-300 h-10 flex items-center justify-center">
          
        </div>
      );
    }

    // Loop through each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isBooked = bookedDates.includes(day); // Check if the day is booked
      const isToday = day === today && isCurrentMonth;

      calendarDays.push(
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded-full w-10 mx-auto transition-all duration-300 ${
            isToday
              ? "bg-indigo-600 text-white"
              : isBooked
              ? "bg-red-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </h2>
          
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          <div className="font-medium text-gray-500">Mon</div>
          <div className="font-medium text-gray-500">Tue</div>
          <div className="font-medium text-gray-500">Wed</div>
          <div className="font-medium text-gray-500">Thu</div>
          <div className="font-medium text-gray-500">Fri</div>
          <div className="font-medium text-gray-500">Sat</div>
          <div className="font-medium text-gray-500">Sun</div>
          {calendarDays}
        </div>
        
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    );
  };

  const getStatusClass = (checkInDate, checkOutDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (now < checkIn) {
      return "bg-yellow-100 text-yellow-800"; // Upcoming
    } else if (now >= checkIn && now <= checkOut) {
      return "bg-green-100 text-green-800"; // Active
    } else {
      return "bg-gray-100 text-gray-800"; // Past
    }
  };

  const getStatusText = (checkInDate, checkOutDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (now < checkIn) {
      return "Upcoming";
    } else if (now >= checkIn && now <= checkOut) {
      return "Active";
    } else {
      return "Completed";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-full mx-auto pl-10 px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-inriaSans font-bold text-gray-900">My Schedule</h1>
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors md:hidden"
          >
            <Calendar className="w-5 h-5" />
            {showCalendar ? "Hide" : "Show"} Calendar
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar - Only shown on mobile when toggled, always visible on desktop */}
          <div className={`${showCalendar ? 'block' : 'hidden'} md:block md:w-1/3`}>
            {renderCalendar()}
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{bookings.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Upcoming</span>
                  <span className="font-semibold">
                    {bookings.filter(b => new Date(b.checkInDate) > new Date()).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-semibold">
                    {bookings.filter(b => {
                      const now = new Date();
                      const checkIn = new Date(b.checkInDate);
                      const checkOut = new Date(b.checkOutDate);
                      return now >= checkIn && now <= checkOut;
                    }).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold">
                    {bookings.filter(b => new Date(b.checkOutDate) < new Date()).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bookings List */}
          <div className="w-full lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
                <button 
                  onClick={() => navigate('/destinations')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                  >
                    <div className="md:flex">
                      {/* Image container - larger on desktop */}
                      <div className="md:w-1/3">
                        <img
                          src={
                            booking.accommodationId?.image
                              ? `http://localhost:3000/uploads/${booking.accommodationId?.image}`
                              : "/api/placeholder/400/300"
                          }
                          alt={booking.accommodationId?.title || "Accommodation"}
                          className="h-48 md:h-full w-full object-cover"
                        />
                      </div>
                      
                      {/* Content container */}
                      <div className="p-6 md:w-2/3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.checkInDate, booking.checkOutDate)}`}>
                                {getStatusText(booking.checkInDate, booking.checkOutDate)}
                              </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {booking.accommodationId?.title || "Unknown Accommodation"}
                            </h3>
                            
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{booking.destinationId?.title || "Unknown Location"}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Cancel booking"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Check-in</p>
                              <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Check-out</p>
                              <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">{calculateDuration(booking.checkInDate, booking.checkOutDate)} nights</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <CreditCard className="w-5 h-5 text-indigo-600 mr-2" />
                            <div>
                              <p className="text-sm text-gray-500">Total Price</p>
                              <p className="font-medium text-indigo-600">
                                Rs. {booking.totalPrice ? booking.totalPrice.toFixed(2) : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingList;