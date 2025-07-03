import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import { Calendar, Loader2, MapPin, DollarSign, Trash2, Edit, PlusCircle, Package } from "lucide-react";

const TourPackageView = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTourPackages();
  }, []);

  const fetchTourPackages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/packages/find");
      setPackages(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching tour packages:", err);
      setError("Failed to load tour packages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`/api/packages/${id}`);
        setPackages((prev) => prev.filter((tour) => tour._id !== id));
        alert("Tour package deleted successfully!");
      } catch (error) {
        console.error("Error deleting Tour package:", error);
        alert("Failed to delete Tour package.");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/editPackages/${id}`);
  };

  const handleAddNew = () => {
    navigate("/uploadpackages");
  };

  const filteredPackages = packages.filter((pkg) => {
    return pkg.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex-1 p-6">
          <div className="flex h-[80vh] items-center justify-center">
            <div className="rounded-xl bg-white p-8 shadow-md">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
              <p className="mt-4 text-center text-gray-600">Loading tour packages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex-1 p-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tour Package Management</h1>
          <p className="text-gray-600">View and manage all available tour packages</p>
        </div>

        {/* Statistics and Action Bar */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Packages</p>
            <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
          </div>
          
          <div className="col-span-1 flex items-center lg:col-span-2">
            <div className="flex w-full flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search packages..."
                  className="w-full rounded-md border border-gray-300 py-2 pl-4 pr-4 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleAddNew}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Package
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            <p>{error}</p>
            <button 
              onClick={fetchTourPackages}
              className="mt-2 text-sm font-medium text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Packages Grid */}
        {!loading && !error && packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow-sm">
            <Package className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tour packages available</h3>
            <p className="mt-1 text-gray-500">
              Get started by creating your first tour package
            </p>
            <button
              onClick={handleAddNew}
              className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Package
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      pkg.image
                        ? `http://localhost:3000/destinations_image/${pkg.image}`
                        : "https://via.placeholder.com/300x200"
                    }
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(pkg._id);
                      }}
                      className="mr-2 rounded-full bg-white p-2 text-gray-700 shadow-md hover:bg-blue-50 hover:text-blue-600"
                      title="Edit package"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pkg._id);
                      }}
                      className="rounded-full bg-white p-2 text-gray-700 shadow-md hover:bg-red-50 hover:text-red-600"
                      title="Delete package"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-medium text-gray-900">{pkg.title}</h3>
                  
                  <div className="mb-3 space-y-2">
                    {pkg.duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{pkg.duration} days</span>
                      </div>
                    )}
                    
                    {pkg.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{pkg.location}</span>
                      </div>
                    )}
                    
                    {pkg.price && (
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <DollarSign className="mr-2 h-4 w-4 text-gray-400" />
                        <span>${pkg.price}</span>
                      </div>
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

export default TourPackageView;