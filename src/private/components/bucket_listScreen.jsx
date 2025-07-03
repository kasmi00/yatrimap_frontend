import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import Navbar from "./NavBar";

const BucketListScreen = () => {
  const [bucketList, setBucketList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBucketList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/bucket-list/");
        setBucketList(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching BucketList", error);
      }
    };

    fetchBucketList();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/bucket-list/${id}`);
      setBucketList(bucketList.filter((item) => item._id !== id)); // Remove item from state
    } catch (error) {
      console.error("Error deleting BucketList item", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dream destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 relative">
            <span className="relative z-10">My Bucket List</span>
          </h1>
        </div>

        {bucketList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">Your bucket list is empty</p>
            <p className="text-gray-500">Start adding destinations you dream of visiting!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bucketList.map((destination) => (
              <div
                key={destination._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      destination.image
                        ? `http://localhost:3000/destinations_image/${destination.image}`
                        : "https://via.placeholder.com/400x300"
                    }
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => handleDelete(destination._id)}
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="Remove from bucket list"
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-start mb-3">
                    <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">
                      {destination.title}
                    </h2>
                  </div>
                  
                  {destination.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {destination.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-2">
                    {destination.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                        {destination.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketListScreen;