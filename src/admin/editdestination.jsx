import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./adminNavbar";

const EditDestination = () => {
  const [destinationData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    image1: "",
    image2: "",
    bestTimeToVisit: "",
    location: "",
    category: "",
    section: "",
  });
  const [imagePreview, setImagePreview] = useState({
    image: null,
    image1: null,
    image2: null,
  });
  const [uploadMode, setUploadMode] = useState("single"); // "single" or "multiple"
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchDestinationData = async () => {
        try {
          const response = await axios.get(`/api/destination/${id}`);
          setFormData({
            title: response.data.title,
            description: response.data.description,
            image: response.data.image,
            image1: response.data.image1,
            image2: response.data.image2,
            bestTimeToVisit: response.data.bestTimeToVisit,
            location: response.data.location,
            category: response.data.category,
            section: response.data.section,
          });
        } catch (error) {
          console.error("Error fetching destination data:", error);
          alert("Failed to load destination data.");
        }
      };

      fetchDestinationData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle single image selection
  const handleSingleImageChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));

      // Create preview URL
      setImagePreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  // Handle multiple image selection
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to exactly 3 images
    if (files.length !== 3) {
      alert("Please select exactly 3 images");
      return;
    }

    // Update form data with all 3 images
    setFormData((prev) => ({
      ...prev,
      image: files[0],
      image1: files[1],
      image2: files[2],
    }));

    // Create preview URLs for all images
    setImagePreview({
      image: URL.createObjectURL(files[0]),
      image1: URL.createObjectURL(files[1]),
      image2: URL.createObjectURL(files[2]),
    });
  };

  // Toggle between single and multiple upload modes
  const toggleUploadMode = () => {
    setUploadMode((prev) => (prev === "single" ? "multiple" : "single"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(destinationData).forEach((key) => {
      if (destinationData[key] !== null) {
        formData.append(key, destinationData[key]);
      }
    });

    try {
      await axios.put(`/api/destination/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Destination updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Failed to update destination. Please try again.");
    }
  };

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 py-4">
            <h2 className="text-2xl font-bold text-center text-white">
              Edit Destination
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={destinationData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={destinationData.description}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a section</option>
                    <option value="TopDestination">Top Destination</option>
                    <option value="MoretoExplore">More to Explore</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Images upload section with toggle */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Destination Images
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {uploadMode === "single"
                      ? "Individual Upload"
                      : "Batch Upload"}
                  </span>
                  <button
                    type="button"
                    onClick={toggleUploadMode}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                  >
                    Switch Mode
                  </button>
                </div>
              </div>

              {uploadMode === "multiple" ? (
                // Multiple images upload
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    name="images"
                    onChange={handleMultipleImagesChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="multi-image-upload"
                  />
                  <label
                    htmlFor="multi-image-upload"
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Click to select exactly 3 images at once
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {imagePreview.image &&
                        imagePreview.image1 &&
                        imagePreview.image2
                          ? "3 images selected"
                          : "JPG, PNG, GIF up to 10MB each"}
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                // Individual image uploads
                <div className="grid grid-cols-3 gap-4">
                  {/* Main Image */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                    <input
                      type="file"
                      name="image"
                      onChange={handleSingleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload-main"
                    />
                    <label
                      htmlFor="image-upload-main"
                      className="cursor-pointer"
                    >
                      {imagePreview.image ? (
                        <div className="relative">
                          <img
                            src={imagePreview.image}
                            alt="Main preview"
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Main
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          <p className="mt-1 text-xs text-gray-500">
                            Main Image
                          </p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Image 1 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                    <input
                      type="file"
                      name="image1"
                      onChange={handleSingleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload-1"
                    />
                    <label htmlFor="image-upload-1" className="cursor-pointer">
                      {imagePreview.image1 ? (
                        <div className="relative">
                          <img
                            src={imagePreview.image1}
                            alt="Image 1 preview"
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Image 1
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          <p className="mt-1 text-xs text-gray-500">Image 1</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Image 2 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                    <input
                      type="file"
                      name="image2"
                      onChange={handleSingleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload-2"
                    />
                    <label htmlFor="image-upload-2" className="cursor-pointer">
                      {imagePreview.image2 ? (
                        <div className="relative">
                          <img
                            src={imagePreview.image2}
                            alt="Image 2 preview"
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            Image 2
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          <p className="mt-1 text-xs text-gray-500">Image 2</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Preview for multiple images (shown only in multiple mode and when images are selected) */}
              {uploadMode === "multiple" &&
                (imagePreview.image ||
                  imagePreview.image1 ||
                  imagePreview.image2) && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imagePreview.image && (
                      <div className="relative">
                        <img
                          src={imagePreview.image}
                          alt="Main preview"
                          className="h-24 w-full object-cover rounded-lg border border-gray-300"
                        />
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Main
                        </span>
                      </div>
                    )}
                    {imagePreview.image1 && (
                      <div className="relative">
                        <img
                          src={imagePreview.image1}
                          alt="Image 1 preview"
                          className="h-24 w-full object-cover rounded-lg border border-gray-300"
                        />
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Image 1
                        </span>
                      </div>
                    )}
                    {imagePreview.image2 && (
                      <div className="relative">
                        <img
                          src={imagePreview.image2}
                          alt="Image 2 preview"
                          className="h-24 w-full object-cover rounded-lg border border-gray-300"
                        />
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Image 2
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Destination
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDestination;
