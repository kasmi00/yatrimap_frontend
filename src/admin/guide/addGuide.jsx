import axios from "axios";
import React, { useState } from "react";
import AdminNavbar from "../adminNavbar";
import { User, Globe, Phone, Briefcase, Mail, PlusCircle, Check } from "lucide-react";

const AddGuide = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
    contact: "",
    languages: "",
    availability: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "availability" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/guides", formData);
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        experience: "",
        contact: "",
        languages: "",
        availability: true,
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving guide:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-100">
      <AdminNavbar />
      
      <div className="flex-1 py-10">
        <div className="max-w-full mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-yellow-100">
              <h1 className="text-2xl font-semibold text-gray-900">Add New Tour Guide</h1>
            </div>
            
            <div className="px-4 pb-5 sm:px-6 bg-yellow-100">
              <p className="text-sm text-gray-500">Enter the details of the new tour guide to add them to your team</p>
            </div>
          </div>

          {showSuccess && (
            <div className="mt-4">
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Guide added successfully!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="bg-blue-100 shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Guide Information</h3>
              </div>
              <div className="mt-2 md:col-span-2">
                <p className="text-sm text-gray-500">Please fill all the required fields</p>
              </div>
            </div>
            
            <div className="mt-5 bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                      <User className="h-5 w-5 mr-1 text-gray-400" /> 
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-4"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="h-5 w-5 mr-1 text-gray-400" /> 
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-4"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="experience" className="flex items-center text-sm font-medium text-gray-700">
                      <Briefcase className="h-5 w-5 mr-1 text-gray-400" /> 
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-4"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="contact" className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="h-5 w-5 mr-1 text-gray-400" /> 
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact"
                      id="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-4"
                      required
                    />
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="languages" className="flex items-center text-sm font-medium text-gray-700">
                      <Globe className="h-5 w-5 mr-1 text-gray-400" /> 
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="languages"
                      id="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full h-8 shadow-sm sm:text-sm border-gray-300 rounded-md p-4 "
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      List all languages the guide can speak fluently, separated by commas.
                    </p>
                  </div>

                  <div className="col-span-6">
                    <div className="flex items-start mt-3">
                      <div className="flex items-center h-5">
                        <input
                          id="availability"
                          name="availability"
                          type="checkbox"
                          checked={formData.availability}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="availability" className="font-medium text-gray-700">
                          Available for Tours
                        </label>
                        <p className="text-gray-500">
                          Uncheck this if the guide is currently unavailable.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        name: "",
                        email: "",
                        experience: "",
                        contact: "",
                        languages: "",
                        availability: true,
                      });
                    }}
                    className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-5 w-5 mr-1" />
                        Add Guide
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGuide;