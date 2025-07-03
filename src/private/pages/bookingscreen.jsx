import axios from "axios";
import { Calendar, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer";

const BookingScreen = () => {
  const { isLoggedIn, userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [destinationDetails, setDestinationDetails] = useState(null);
  const [accommodation, setAccommodation] = useState(null);
  const [guides, setGuides] = useState([]);
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guideId: "",
    totalPrice: 0,
    userId: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location } });
    } else {
      setFormData((prev) => ({ ...prev, userId }));
    }
  }, [isLoggedIn, navigate, location, userId]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const destinationId = queryParams.get("destinationId");
    const accommodationId = queryParams.get("accommodations");

    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const destResponse = await axios.get(
          `/api/destination/${destinationId}`
        );
        setDestinationDetails(destResponse.data);

        if (accommodationId) {
          const accomResponse = await axios.get(
            `/api/accommodation/select/${accommodationId}`
          );
          setAccommodation(accomResponse.data);
        }

        const guidesResponse = await axios.get("/api/guides");
        setGuides(guidesResponse.data);

        if (guidesResponse.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            guideId: guidesResponse.data[0]._id,
          }));
        }
      } catch (err) {
        setError("Failed to load booking information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchBookingData();
    }
  }, [location, isLoggedIn, userId]);

  const calculateTotalPrice = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;

    const startDate = new Date(formData.checkInDate);
    const endDate = new Date(formData.checkOutDate);
    const nights = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = accommodation ? accommodation.price : 0;

    return pricePerNight * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: location,
          message: "Please log in to complete your booking",
        },
      });
      return;
    }

    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);

    if (
      !formData.checkInDate ||
      !formData.checkOutDate ||
      isNaN(start) ||
      isNaN(end) ||
      start >= end
    ) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      alert("Invalid booking configuration. Please check your selections.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/booking/create", {
        userId: formData.userId,
        destinationId: destinationDetails?._id,
        accommodationId: accommodation?._id,
        guideId: formData.guideId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        totalPrice,
      });

      alert("Booking successful!");
      navigate("/bookingList");
    } catch (err) {
      alert("Failed to confirm booking. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg shadow-md bg-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded-lg shadow-md">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            <h2 className="text-lg font-medium mb-2">Error</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const selectedGuide = guides.find((g) => g._id === formData.guideId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-full mx-auto p-8">
        <div className="mb-8 border-b pb-2">
          <h1 className="text-3xl font-serif text-gray-800">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to finalize your travel plans
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Destination & Accommodation */}
          <div className="lg:col-span-2 space-y-4">
            {destinationDetails && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-inriaSans font-bold mb-4 text-black border-b pb-2">
                  Destination
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={
                      destinationDetails.image
                        ? `http://localhost:3000/destinations_image/${destinationDetails.image}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={destinationDetails.name}
                    className="w-full md:w-1/3 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-inriaSans font-bold mb-2 text-gray-800">
                      {destinationDetails.name || destinationDetails.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-yellow-500" />
                      {destinationDetails.location}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                    <Calendar className="h-5 w-5 text-blue-500" />
                      {destinationDetails.bestTimeToVisit}
                    </div>
                    <p className="pl-2 pt-1 text-gray-600 line-clamp-2">
                      {destinationDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {accommodation && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-inriaSans font-bold mb-4 text-black border-b pb-2">
                  Accommodation
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={
                      accommodation.image
                        ? `http://localhost:3000/uploads/${accommodation.image}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={accommodation.name}
                    className="w-full md:w-1/3 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-inriaSans font-bold mb-2 text-gray-800">
                      {accommodation.title}
                    </h3>
                    <p className="pl-2 text-gray-600 line-clamp-2 mb-4">
                      {accommodation.description}
                    </p>
                    <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md">
                      <span className="font-medium">Price per night</span>
                      <span className="text-amber-600 font-inriaSans font-semibold">
                        ${accommodation.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedGuide && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-inriaSans font-bold mb-4 text-black border-b pb-2">
                  Tour Guide
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {selectedGuide.image ? (
                      <img
                        src={`http://localhost:3000/guides/${selectedGuide.image}`}
                        alt={selectedGuide.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xl text-gray-500">
                        {selectedGuide.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-inriaSans font-bold">
                      {selectedGuide.name}
                    </h3>
                    <h4 className="pt-2 font-medium text-sm text-gray-500">
                      {selectedGuide.experience} years
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-inriaSans font-bold mb-4 text-gray-800 border-b pb-2">
                Booking Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    value={formData.checkInDate}
                    onChange={(e) =>
                      setFormData({ ...formData, checkInDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    value={formData.checkOutDate}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOutDate: e.target.value })
                    }
                    min={
                      formData.checkInDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Tour Guide
                  </label>
                  <select
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    value={formData.guideId}
                    onChange={(e) =>
                      setFormData({ ...formData, guideId: e.target.value })
                    }
                  >
                    {guides.map((guide) => (
                      <option key={guide._id} value={guide._id}>
                        {guide.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-lg font-inriaSans font-bold mb-3">Booking Summary</h3>

                  {formData.checkInDate && formData.checkOutDate && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Check-in:</span>
                        <span>
                          {new Date(formData.checkInDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Check-out:</span>
                        <span>
                          {new Date(formData.checkOutDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nights:</span>
                        <span>
                          {Math.max(
                            1,
                            Math.floor(
                              (new Date(formData.checkOutDate) -
                                new Date(formData.checkInDate)) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-t border-b text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-amber-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-black font-Inter font-semibold py-3 rounded-lg hover:bg-yellow-600 transition duration-200 mt-4"
                  disabled={
                    submitting ||
                    !formData.checkInDate ||
                    !formData.checkOutDate
                  }
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingScreen;
