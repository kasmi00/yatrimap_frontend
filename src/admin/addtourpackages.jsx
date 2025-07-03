import axios from "axios";
import React, { useState } from "react";
import AdminNavbar from "./adminNavbar";

const UploadTourPackage = () => {
  const [tourData, setTourData] = useState({
    title: "",
    image: null,
    image1: null,
    highlights: [],
    itinerary: [],
    price: "",
    duration: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [currentHighlight, setCurrentHighlight] = useState({ day: "", description: "" });
  const [currentItinerary, setCurrentItinerary] = useState({ day: "", description: "" });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle highlights input
  const handleHighlightChange = (e) => {
    const { name, value } = e.target;
    setCurrentHighlight(prev => ({ ...prev, [name]: value }));
  };

  // Add highlight to the list
  const addHighlight = () => {
    if (currentHighlight.day && currentHighlight.description) {
      setTourData(prev => ({
        ...prev,
        highlights: [...prev.highlights, currentHighlight]
      }));
      setCurrentHighlight({ day: "", description: "" });
    }
  };

  // Handle itinerary input
  const handleItineraryChange = (e) => {
    const { name, value } = e.target;
    setCurrentItinerary(prev => ({ ...prev, [name]: value }));
  };

  // Add itinerary to the list
  const addItinerary = () => {
    if (currentItinerary.day && currentItinerary.description) {
      setTourData(prev => ({
        ...prev,
        itinerary: [...prev.itinerary, currentItinerary]
      }));
      setCurrentItinerary({ day: "", description: "" });
    }
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      setTourData((prev) => ({ ...prev, [name]: file }));

      if (name === "image") {
        setImagePreview(URL.createObjectURL(file));
      } else if (name === "image1") {
        setImagePreview1(URL.createObjectURL(file));
      }
    }
  };

  // Remove a highlight
  const removeHighlight = (index) => {
    setTourData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Remove an itinerary item
  const removeItinerary = (index) => {
    setTourData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(tourData).forEach((key) => {
      if (Array.isArray(tourData[key])) {
        formData.append(key, JSON.stringify(tourData[key])); // Convert array to JSON string
      } else {
        formData.append(key, tourData[key]);
      }
    });

    try {
      await axios.post("/api/packages/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Tour Package uploaded successfully!");

      setTourData({
        title: "",
        image: null,
        image1: null,
        highlights: [],
        itinerary: [],
        price: "",
        duration: "",
        description: "",
      });

      setImagePreview(null);
      setImagePreview1(null);
    } catch (error) {
      console.error("Error uploading tour package:", error);
      alert("Failed to upload tour package. Please try again.");
    }
  };

  return (
    <div className="ml-64 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h2 className="text-2xl font-bold text-white">Create New Tour Package</h2>
            <p className="text-blue-100 mt-2">Fill in the details to create a new tour package</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                  <input
                    type="text"
                    name="title"
                    value={tourData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Bali Adventure Package"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                      id="primary-image"
                    />
                    <label htmlFor="primary-image" className="cursor-pointer">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="py-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="mt-1 text-sm text-gray-500">Click to upload main image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition">
                    <input
                      type="file"
                      name="image1"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                      id="secondary-image"
                    />
                    <label htmlFor="secondary-image" className="cursor-pointer">
                      {imagePreview1 ? (
                        <img
                          src={imagePreview1}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="py-4">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p className="mt-1 text-sm text-gray-500">Click to upload secondary image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      name="price"
                      value={tourData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 1299"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={tourData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 days"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Description</label>
                  <textarea
                    name="description"
                    value={tourData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the tour package..."
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Highlights Section */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Highlights</label>
                    <span className="text-xs text-gray-500">{tourData.highlights.length} added</span>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      name="day"
                      value={currentHighlight.day}
                      onChange={handleHighlightChange}
                      placeholder="Day/Title"
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="description"
                      value={currentHighlight.description}
                      onChange={handleHighlightChange}
                      placeholder="Highlight description"
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition"
                  >
                    + Add Highlight
                  </button>

                  {/* Display added highlights */}
                  {tourData.highlights.length > 0 && (
                    <div className="mt-3 max-h-32 overflow-y-auto">
                      {tourData.highlights.map((highlight, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md mb-2 text-sm">
                          <div>
                            <span className="font-medium">{highlight.day}:</span> {highlight.description}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Itinerary Section */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Itinerary</label>
                    <span className="text-xs text-gray-500">{tourData.itinerary.length} added</span>
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      name="day"
                      value={currentItinerary.day}
                      onChange={handleItineraryChange}
                      placeholder="Day/Title"
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      name="description"
                      value={currentItinerary.description}
                      onChange={handleItineraryChange}
                      placeholder="Itinerary description"
                      className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addItinerary}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition"
                  >
                    + Add Itinerary Day
                  </button>

                  {/* Display added itinerary items */}
                  {tourData.itinerary.length > 0 && (
                    <div className="mt-3 max-h-32 overflow-y-auto">
                      {tourData.itinerary.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md mb-2 text-sm">
                          <div>
                            <span className="font-medium">{item.day}:</span> {item.description}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItinerary(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Create Tour Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadTourPackage;