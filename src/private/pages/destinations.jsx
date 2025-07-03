import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CategoryBar from "../components/categoryBar";
import Navbar from "../components/NavBar";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [Bucketlist, setBucketlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory) {
      fetchDestinations();
    }
  }, [selectedCategory]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/destination/category/${selectedCategory}`
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched destinations data:", data);
      setDestinations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load destinations");
    }
    setLoading(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const gotoDestinationDetails = (id) => {
    navigate(`/destinationdetails/${id}`);
  };

  const toggleBucketList = async (destination) => {
    try {
      const isAlreadyInBucketList = Bucketlist.some(
        (item) => item._id === destination._id
      );

      if (isAlreadyInBucketList) {
        setBucketlist(
          Bucketlist.filter((item) => item._id !== destination._id)
        );
      } else {
        setBucketlist([...Bucketlist, destination]);
        await axios.post("http://localhost:3000/api/bucket-list/", destination);
      }
    } catch (error) {
      console.error("Failed to update bucketlist", error);
    }
  };

  const filteredDestinations = destinations.filter(destination =>
    destination.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-full mx-auto p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Discover Amazing Places</h1>
        </div>

        <div className="relative mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full py-2 px-4 pr-10 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute right-4 top-3.5 text-gray-400" />
        </div>

        <div className="mb-8">
          <CategoryBar onCategorySelect={handleCategorySelect} />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center mb-6">
            {error}
          </div>
        )}

        {!loading && filteredDestinations.length === 0 && selectedCategory && (
          <div className="text-center py-12 text-gray-500">
            No destinations found in this category.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <div
              key={destination._id}
              className="group relative rounded-2xl overflow-hidden shadow-xl bg-white transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className="relative h-[350px] overflow-hidden cursor-pointer"
                onClick={() => gotoDestinationDetails(destination._id)}
              >
                <div className="absolute top-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-br-lg z-10 font-medium">
                  {destination.category || "Featured"}
                </div>

                <img
                  src={
                    destination.image
                      ? `http://localhost:3000/destinations_image/${destination.image}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={destination.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBucketList(destination);
                  }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
                >
                  <FaHeart
                    className={`w-5 h-5 ${Bucketlist.some((item) => item._id === destination._id)
                      ? "text-red-500"
                      : "text-gray-400"
                      }`}
                  />
                </button>
              </div>

              <div className="p-5" onClick={() => gotoDestinationDetails(destination._id)}>
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-indigo-500 mt-1 mr-2 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{destination.title}</h2>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                  {destination.description}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 font-medium text-sm"
                    onClick={() => gotoDestinationDetails(destination._id)}
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Destinations;