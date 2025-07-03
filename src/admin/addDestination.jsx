import axios from "axios";
import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import AdminNavbar from "./adminNavbar";

const UploadDestination = () => {
  const [destinationData, setDestinationData] = useState({
    title: "",
    description: "",
    image: null,
    image1: null,
    image2: null,
    category: "",
    bestTimeToVisit: "",
    location: "",
    section: "TopDestination",
  });
  
  const [imagePreviews, setImagePreviews] = useState({
    image: null,
    image1: null,
    image2: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDestinationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setDestinationData((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreviews(prev => ({ 
        ...prev, 
        [name]: URL.createObjectURL(files[0]) 
      }));
    }
  };

  const removeImage = (fieldName) => {
    setDestinationData(prev => ({ ...prev, [fieldName]: null }));
    setImagePreviews(prev => ({ ...prev, [fieldName]: null }));
    // Reset the file input
    const fileInput = document.querySelector(`input[name="${fieldName}"]`);
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    const formData = new FormData();
    Object.keys(destinationData).forEach((key) => {
      if (destinationData[key] !== null) {
        formData.append(key, destinationData[key]);
      }
    });

    try {
      await axios.post("/api/destination", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess(true);
      setDestinationData({
        title: "",
        description: "",
        image: null,
        image1: null,
        image2: null,
        category: "",
        bestTimeToVisit: "",
        location: "",
        section: "TopDestination",
      });
      setImagePreviews({
        image: null,
        image1: null,
        image2: null
      });
    } catch (error) {
      console.error("Error uploading destination:", error);
      alert("Failed to upload destination. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ml-64 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="max-w-full mx-auto">
        <div className="bg-white shadow-md overflow-hidden">
          <div className="bg-indigo-500 py-6 px-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Upload className="mr-2" size={24} />
              Add New Destination
            </h2>
            <p className="text-blue-100 mt-1">Fill in the details to add a new travel destination</p>
          </div>
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Destination uploaded successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={destinationData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Eiffel Tower, Paris"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={destinationData.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the destination..."
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={destinationData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Kathmandu, Nepal"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={destinationData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Mountain, city, Historical"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Best Time To Visit
                </label>
                <input
                  type="text"
                  name="bestTimeToVisit"
                  value={destinationData.bestTimeToVisit}
                  onChange={handleInputChange}
                  placeholder="e.g. Spring (March to May)"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section
                </label>
                <select
                  name="section"
                  value={destinationData.section}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="TopDestination">Top Destination</option>
                  <option value="MoretoExplore">More to Explore</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Destination Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Image */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    
                    {imagePreviews.image ? (
                      <div className="relative">
                        <img
                          src={imagePreviews.image}
                          alt="Preview"
                          className="h-48 w-full object-cover rounded-lg"
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage('image')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <input
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                          id="mainImage"
                          accept="image/*"
                        />
                        <label 
                          htmlFor="mainImage"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-10 w-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload image</span>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Image 1 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Image 1
                    </label>
                    
                    {imagePreviews.image1 ? (
                      <div className="relative">
                        <img
                          src={imagePreviews.image1}
                          alt="Preview"
                          className="h-48 w-full object-cover rounded-lg"
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage('image1')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <input
                          type="file"
                          name="image1"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                          id="image1"
                          accept="image/*"
                        />
                        <label 
                          htmlFor="image1"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-10 w-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload image</span>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Image 2 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Image 2
                    </label>
                    
                    {imagePreviews.image2 ? (
                      <div className="relative">
                        <img
                          src={imagePreviews.image2}
                          alt="Preview"
                          className="h-48 w-full object-cover rounded-lg"
                        />
                        <button 
                          type="button"
                          onClick={() => removeImage('image2')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <input
                          type="file"
                          name="image2"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                          id="image2"
                          accept="image/*"
                        />
                        <label 
                          htmlFor="image2"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-10 w-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload image</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-6 py-3 rounded-lg font-medium focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Upload Destination"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadDestination;