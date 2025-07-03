import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../adminNavbar";
import { PlusCircle, Edit, User, Mail, Phone, Briefcase, Globe, CheckCircle, XCircle } from "lucide-react";

const GuideList = () => {
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/guides");
        setGuides(response.data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const handleUpdate = (guide) => {
    navigate("/editguide", { state: { guide } });
  };

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      <AdminNavbar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tour Guides</h1>
              <p className="text-gray-600 mt-1">Manage your tour guide team</p>
            </div>
            <Link
              to="/addguide"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
            >
              <PlusCircle size={18} />
              <span>Add New Guide</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-6 w-6 bg-blue-200 rounded-full"></div>
              </div>
              <p className="text-gray-500 mt-4">Loading guides...</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <User size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800">No guides found</h3>
              <p className="text-gray-600 mt-2">Add your first tour guide to get started</p>
              <Link
                to="/addguide"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4 transition-colors duration-200"
              >
                <PlusCircle size={18} />
                <span>Add Guide</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <div key={guide._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{guide.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>{guide.experience} years</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guide.availability 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {guide.availability ? "Available" : "Unavailable"}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{guide.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{guide.contact}</span>
                      </div>
                      <div className="flex items-start text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2 mt-1 text-gray-400" />
                        <span>{Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3">
                    <button
                      onClick={() => handleUpdate(guide)}
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-md transition-colors duration-200"
                    >
                      <Edit size={16} />
                      <span>Edit Guide</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideList;