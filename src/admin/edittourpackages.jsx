import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./adminNavbar";

const EditTourPackage = () => {
  const [tourData, setTourData] = useState({
    title: "",
    image: "",
    image1: "",
    highlights: [],
    itinerary: [],
    price: "",
    duration: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [image1Preview, setImage1Preview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing tour package details
  useEffect(() => {
    if (id) {
      const fetchTourPackageData = async () => {
        try {
          const response = await axios.get(`/api/packages/${id}`);
          setTourData({
            title: response.data.title,
            image: response.data.image,
            image1: response.data.image1,
            highlights: response.data.highlights || [],
            itinerary: response.data.itinerary || [],
            price: response.data.price,
            duration: response.data.duration,
            description: response.data.description,
          });
          setImagePreview(response.data.image);
          setImage1Preview(response.data.image1);
        } catch (error) {
          console.error("Error fetching tour package data:", error);
          alert("Failed to load tour package data.");
        } finally {
          setLoading(false);
        }
      };
      fetchTourPackageData();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file uploads
  const handleFileChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setTourData((prev) => ({ ...prev, [imageKey]: file }));
      if (imageKey === "image") {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImage1Preview(URL.createObjectURL(file));
      }
    }
  };

  // Handle list fields like highlights & itinerary
  const handleListChange = (e, field) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setTourData((prev) => ({ ...prev, [field]: values }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(tourData).forEach((key) => {
      if (Array.isArray(tourData[key])) {
        // Instead of stringifying, append each item separately
        tourData[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, tourData[key]);
      }
    });

    try {
      await axios.put(`/api/packages/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tour Package updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating tour package:", error);
      alert("Failed to update tour package. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="ml-64 p-6 flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading package data...</p>
        </div>
      </div>
    );
  }

  const TabButton = ({ name, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(name)}
      className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
        activeTab === name
          ? "bg-white text-blue-600 border-b-2 border-blue-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="ml-64 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-full mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Tour Package
            </h2>
            <p className="text-gray-500 mt-1">
              Make changes to the tour package details below
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <TabButton name="details" label="Basic Details" />
            <TabButton name="content" label="Content & Description" />
            <TabButton name="media" label="Media" />
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Details Tab */}
            <div className={activeTab === "details" ? "block" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Package Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={tourData.title}
                    onChange={handleInputChange}
                    placeholder="Package Name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={tourData.price}
                    onChange={handleInputChange}
                    placeholder="Price (in USD)"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={tourData.duration}
                    onChange={handleInputChange}
                    placeholder="Duration (e.g., 5 days, 1 week)"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Content Tab */}
            <div className={activeTab === "content" ? "block" : "hidden"}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlights 
                    <span className="ml-1 text-gray-500 text-xs">(comma-separated)</span>
                  </label>
                  <textarea
                    name="highlights"
                    value={tourData.highlights.join(", ")}
                    onChange={(e) => handleListChange(e, "highlights")}
                    placeholder="Highlights (comma-separated)"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Itinerary 
                    <span className="ml-1 text-gray-500 text-xs">(comma-separated)</span>
                  </label>
                  <textarea
                    name="itinerary"
                    value={tourData.itinerary.join(", ")}
                    onChange={(e) => handleListChange(e, "itinerary")}
                    placeholder="Itinerary (comma-separated)"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Package Description
                  </label>
                  <textarea
                    name="description"
                    value={tourData.description}
                    onChange={handleInputChange}
                    placeholder="Package Description"
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Media Tab */}
            <div className={activeTab === "media" ? "block" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Primary Image
                    </label>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                      <div className="space-y-2 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          name="image"
                          onChange={(e) => handleFileChange(e, "image")}
                          className="opacity-0 absolute inset-0 w-full cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Image Preview
                      </label>
                      <div className="relative border rounded-lg overflow-hidden h-48">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Secondary Image
                    </label>
                    <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                      <div className="space-y-2 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          name="image1"
                          onChange={(e) => handleFileChange(e, "image1")}
                          className="opacity-0 absolute inset-0 w-full cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  {image1Preview && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Image Preview
                      </label>
                      <div className="relative border rounded-lg overflow-hidden h-48">
                        <img
                          src={image1Preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "details" ? "content" : activeTab === "content" ? "media" : "details")}
                  className="px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {activeTab === "media" ? "Previous" : "Next"}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Package
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTourPackage;