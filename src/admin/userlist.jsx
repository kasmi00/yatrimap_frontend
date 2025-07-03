import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNavbar from "./adminNavbar";
import { Trash2, Search, UserX, Users, Filter, ChevronDown, X } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/user");
        // Filter out admin users
        const filteredUsers = response.data.filter(
          (user) => user.role !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search input and active filter
  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      
      if (activeFilter === "all") return matchesSearch;
      if (activeFilter === "recent") {
        // Example filter - users created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return matchesSearch && new Date(user.createdAt) > thirtyDaysAgo;
      }
      return matchesSearch;
    }
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/user/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setConfirmDelete(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <AdminNavbar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Users className="mr-2 text-blue-600" />
                  User Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Total of {users.length} registered users in the system
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                {/* Search box */}
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setSearch("")}
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                
                {/* Filter dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-full sm:w-36 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{activeFilter === "all" ? "All Users" : "Recent Users"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {filterOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${activeFilter === "all" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                            onClick={() => {
                              setActiveFilter("all");
                              setFilterOpen(false);
                            }}
                          >
                            All Users
                          </button>
                        </li>
                        <li>
                          <button
                            className={`block px-4 py-2 text-sm w-full text-left ${activeFilter === "recent" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                            onClick={() => {
                              setActiveFilter("recent");
                              setFilterOpen(false);
                            }}
                          >
                            Recent Users
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User List Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <>
                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user, index) => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" 
                                  style={{ 
                                    backgroundColor: `hsl(${(index * 60) % 360}, 70%, 90%)`,
                                    color: `hsl(${(index * 60) % 360}, 70%, 30%)`
                                  }}>
                                  <span className="font-medium text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                  <div className="text-xs text-gray-500">User ID: {user._id?.substring(0, 8) || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${index % 3 === 0 ? 'bg-green-100 text-green-800' : index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Pending' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {confirmDelete === user._id ? (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md border border-gray-300 text-xs"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(user._id)}
                                  className="text-red-500 hover:text-red-700 flex items-center justify-center space-x-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-100 rounded-full p-4 mb-4">
                      <UserX className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-gray-500 max-w-md">
                      {search ? `No results matching "${search}"` : "There are no users in the system that match your current filters"}
                    </p>
                    {(search || activeFilter !== "all") && (
                      <button 
                        onClick={() => {
                          setSearch("");
                          setActiveFilter("all");
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary card */}
          {!loading && filteredUsers.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> total users
                {search && <span> (filtered by "<span className="font-medium">{search}</span>")</span>}
                {activeFilter !== "all" && <span> with filter: <span className="font-medium">{activeFilter}</span></span>}
              </p>
              
              <div className="flex space-x-2">
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSearch("");
                    setActiveFilter("all");
                  }}
                  disabled={!search && activeFilter === "all"}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;