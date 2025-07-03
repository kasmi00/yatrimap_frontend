import axios from "axios";
import { Calendar, Check, MapPin, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import AccommodationList from "../components/accommodationlist";

const DestinationDetails = () => {
  const [destination, setDestination] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [BucketList, setBucketlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      try {
        const response = await axios.get(`/api/destination/${id}`);
        setDestination(response.data);
      } catch (err) {
        setError("Failed to fetch destination details");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [id]);

  const toggleBucketList = async (destination) => {
    try {
      const isAlreadyInBucketList = BucketList.some(
        (item) => item._id === destination._id
      );

      if (isAlreadyInBucketList) {
        setBucketlist(
          BucketList.filter((item) => item._id !== destination._id)
        );
      } else {
        setBucketlist([...BucketList, destination]);
        await axios.post("http://localhost:3000/api/bucket-list/", destination);
      }
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium text-gray-600">
          Loading your destination...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600 font-medium">{error}</div>
      </div>
    );

  if (!destination)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 font-medium">
          Destination not found
        </div>
      </div>
    );

  const handleSelectAccommodation = (accommodationId) => {
    setSelectedAccommodation(
      accommodationId === selectedAccommodation ? null : accommodationId
    );
  };

  const handleBookNow = () => {
    if (!selectedAccommodation) {
      alert("Please select an accommodation before booking.");
      return;
    }
    navigate(
      `/booking?destinationId=${destination._id}&accommodations=${selectedAccommodation}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-full mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Left large image */}
          <div className="h-[540px] relative group">
            <img
              src={
                destination.image
                  ? `http://localhost:3000/destinations_image/${destination.image}`
                  : "https://via.placeholder.com/150"
              }
              className="w-full h-full object-cover rounded-xl"
              alt={destination.title}
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl" />
          </div>

          {/* Right column with two images */}
          <div className="flex flex-col gap-4 h-[525px]">
            <div className="h-1/2 relative group">
              <img
                src={
                  destination.image1
                    ? `http://localhost:3000/destinations_image/${destination.image1}`
                    : "https://via.placeholder.com/150"
                }
                className="w-full h-full object-cover rounded-xl"
                alt={`${destination.title} view 1`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl" />
            </div>
            <div className="h-1/2 relative group">
              <img
                src={
                  destination.image2
                    ? `http://localhost:3000/destinations_image/${destination.image2}`
                    : "https://via.placeholder.com/150"
                }
                className="w-full h-full object-cover rounded-xl"
                alt={`${destination.title} view 2`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Location */}
            <div className="mb-8">
              <h1 className="text-4xl font-inriaSans font-bold text-gray-900 mb-4">
                {destination.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-500" />
                  {destination.location}
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-red-600" />
                  {destination.category}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  {destination.bestTimeToVisit}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-Inter font-bold mb-4">
                About this Destination
              </h2>
              <p className="text-gray-600  font-inriaSans leading-relaxed">
                {destination.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-inriaSans font-bold">
                    Book Your Stay
                  </h3>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaHeart
                      className={`absolute top-4 right-4 cursor-pointer text-2xl ${
                        BucketList.some((item) => item._id === destination._id)
                          ? "text-red-600"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                      onClick={() => toggleBucketList(destination)}
                    />
                  </button>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-blue-600 text-white font-Inter py-4 rounded-xl hover:bg-blue-500 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Redesigned Accommodation Section */}
        <div className="p-6">
          <h3 className="text-2xl font-Inter font-bold">
            Select Your Accommodation
          </h3>
          <div className="flex flex-col gap-4">
            <AccommodationList
              onSelect={handleSelectAccommodation}
              selectedAccommodation={selectedAccommodation}
              renderItem={(accommodation) => (
                <div
                  className={`bg-white rounded-xl p-6 border-2 transition-all duration-300 ${
                    selectedAccommodation === accommodation._id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-semibold mb-2">
                        {accommodation.name}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {accommodation.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {accommodation.amenities?.map((amenity, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1 rounded-full"
                          >
                            <Check className="h-4 w-4 text-green-500" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${accommodation.price}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
