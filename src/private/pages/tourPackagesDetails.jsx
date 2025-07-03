import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

const TourPackageDetails = () => {
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const { id } = useParams();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`/api/packages/${id}`);
        setPackageDetails(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const Tab = ({ id, label, active }) => (
    <button
      className={`px-6 py-3 font-medium ${
        active
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-blue-500"
      }`}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-full">
        <Navbar/>
    <div className="p-6 mx-auto bg-gray-50">
      {packageDetails && (
        <>
          {/* Hero Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={
                    packageDetails.image
                      ? `http://localhost:3000/destinations_image/${packageDetails.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={`${packageDetails.title} main`}
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src={
                    packageDetails.image1
                      ? `http://localhost:3000/destinations_image/${packageDetails.image1}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={`${packageDetails.title} secondary`}
                  className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 border-b">
            <div className="flex overflow-x-auto justify-around">
              <Tab id="description" label="Description" active={activeTab === "description"} />
              <Tab id="highlights" label="Highlights" active={activeTab === "highlights"} />
              <Tab id="itinerary" label="Itinerary" active={activeTab === "itinerary"} />
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Description Tab */}
            {activeTab === "description" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">About This Tour</h2>
                <p className="text-gray-700 leading-relaxed">{packageDetails.description}</p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800">Tour Details</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="ml-2 text-gray-700">Duration: {packageDetails.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="ml-2 text-gray-700">Price: ${packageDetails.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Highlights Tab */}
            {activeTab === "highlights" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Tour Highlights</h2>
                {packageDetails.highlights && packageDetails.highlights.length > 0 ? (
                  <div className="space-y-4">
                    {packageDetails.highlights.map((highlight, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-semibold text-lg text-blue-800">
                          {highlight.highlight || (typeof highlight === 'string' ? highlight : '')}
                        </h3>
                        {highlight.description && (
                          <p className="text-gray-700 mt-1">{highlight.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">No highlights available for this tour.</p>
                )}
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === "itinerary" && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Tour Itinerary</h2>
                {packageDetails.itinerary && packageDetails.itinerary.length > 0 ? (
                  <div className="space-y-4">
                    {packageDetails.itinerary.map((item, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          {index < packageDetails.itinerary.length - 1 && (
                            <div className="h-full w-0.5 bg-blue-200 my-1"></div>
                          )}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-grow mb-2">
                          <h3 className="font-semibold text-lg text-blue-800">
                            {item.day || (typeof item === 'string' ? `Day ${index + 1}` : '')}
                          </h3>
                          <p className="text-gray-700 mt-1">
                            {item.description || (typeof item === 'string' ? item : '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">No itinerary available for this tour.</p>
                )}
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-blue-400 text-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Ready for an adventure?</h3>
                <p className="mt-2">Book this tour package now and get ready for an unforgettable experience.</p>
              </div>
              <button className="mt-4 md:mt-0 bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default TourPackageDetails;