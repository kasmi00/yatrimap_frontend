import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminNavbar from "./adminNavbar";

const UploadAccommodation = () => {
  const [accommodationData, setAccommodationData] = useState({
    title: "",
    price: "",
    image: null,
    description: "",
    destination: "",
  });

  const [destinations, setDestinations] = useState([]); // Stores available destinations
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  // Fetch destinations from API
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/destination") // Ensure the base URL is correct
      .then((response) => {
        setDestinations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccommodationData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change (for image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAccommodationData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file)); // Image preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (
      !accommodationData.title ||
      !accommodationData.price ||
      !accommodationData.image ||
      !accommodationData.description ||
      !accommodationData.destination
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", accommodationData.title);
    formData.append("price", Number(accommodationData.price)); // Ensure price is a number
    formData.append("image", accommodationData.image);
    formData.append("description", accommodationData.description);
    formData.append("destination", accommodationData.destination);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/accommodation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Accommodation uploaded successfully!");
      console.log("Response:", response.data);

      // Reset form
      setAccommodationData({
        title: "",
        price: "",
        image: null,
        description: "",
        destination: "",
      });
      setImagePreview(null);
    } catch (error) {
      console.error(
        "Error uploading accommodation:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response?.data?.error || "Failed to upload. Please check inputs."
      );
    }
  };

  return (
    <div className="ml-64 p-6">
      <AdminNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Upload Accommodation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                name="title"
                value={accommodationData.title}
                onChange={handleInputChange}
                placeholder="Accommodation Title"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <input
                type="number"
                name="price"
                value={accommodationData.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                value={accommodationData.description}
                onChange={handleInputChange}
                placeholder="Accommodation Description"
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Destination Selection */}
            <div>
              <select
                name="destination"
                value={accommodationData.destination}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Destination</option>
                {destinations.map((destination) => (
                  <option key={destination._id} value={destination._id}>
                    {destination.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAccommodation;
