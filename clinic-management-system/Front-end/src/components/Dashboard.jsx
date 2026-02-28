 import React, { useEffect, useState, useRef } from "react";
import { getAllUsers, deleteUser, updateUser, getUserById, registerUser, logoutUser } from "../services/api";
import { Eye, EyeOff, Edit2, Trash2, Plus, X, Search } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [logo, setLogo] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showLogoMenu, setShowLogoMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // User Management States
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state for create/update
  const [formData, setFormData] = useState({
    ownerName: "",
    clinicName: "",
    name: "",
    email: "",
    password: "",
    role: "clinicAdmin",
    phone: "",
    address: ""
  });

  const logoInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      window.location.href = "/";
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUsers();
    } catch (error) {
      window.location.href = "/";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await logoutUser();
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Trigger events to update Navbar
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("authChange"));
      window.location.href = "/";
    }
  };

  // User Management Functions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      ownerName: "",
      clinicName: "",
      name: "",
      email: "",
      password: "",
      role: "clinicAdmin",
      phone: "",
      address: ""
    });
    setShowUserModal(true);
  };

  const handleEditUser = async (userId) => {
    try {
      const response = await getUserById(userId);
      if (response && response.success && response.user) {
        const userData = response.user;
        setSelectedUser(userData);
        setFormData({
          ownerName: userData.ownerName || "",
          clinicName: userData.clinicName || "",
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          role: userData.role || "clinicAdmin",
          phone: userData.phone || "",
          address: userData.address || ""
        });
        setShowUserModal(true);
      } else {
        alert("Failed to fetch user data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      const errorMessage = error?.message || error?.error || "Failed to fetch user data. Please try again.";
      alert(errorMessage);
    }
  };

  const handleDeleteClick = (userToDelete) => {
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await deleteUser(selectedUser._id);
      if (response && response.success) {
        fetchUsers();
        setShowDeleteModal(false);
        setSelectedUser(null);
        // Show success message (you can add a toast notification here)
        alert("User deleted successfully");
      } else {
        alert(response?.message || "Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage = error?.message || error?.error || "Failed to delete user. Please try again.";
      alert(errorMessage);
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedUser) {
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        const response = await updateUser(selectedUser._id, updateData);
        if (response && response.success) {
          setShowUserModal(false);
          fetchUsers();
          alert("User updated successfully");
        } else {
          alert(response?.message || "Failed to update user. Please try again.");
        }
      } else {
        // Create new user
        const userData = { ...formData };
        const response = await registerUser(userData);
        if (response && response.success) {
          setShowUserModal(false);
          fetchUsers();
          alert("User created successfully");
        } else {
          alert(response?.message || "Failed to create user. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage = error?.message || error?.error || "Failed to save user. Please try again.";
      alert(errorMessage);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.email?.toLowerCase().includes(searchLower) ||
      u.ownerName?.toLowerCase().includes(searchLower) ||
      u.clinicName?.toLowerCase().includes(searchLower) ||
      u.name?.toLowerCase().includes(searchLower) ||
      u.phone?.includes(searchTerm)
    );
  });

  // Clinic Logo handlers
  const handleLogoClick = () => setShowLogoMenu((prev) => !prev);
  const handleLogoOption = (action) => {
    if (action === "change") logoInputRef.current.click();
    else if (action === "delete") setLogo(null);
    setShowLogoMenu(false);
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Profile Picture handlers
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
    setShowProfileMenu(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <div
                className="cursor-pointer w-12 h-12 flex items-center justify-center"
                onClick={handleLogoClick}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt="Clinic Logo"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                    {user.clinicName?.charAt(0) || "C"}
                  </div>
                )}
              </div>
              {showLogoMenu && (
                <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-md border border-gray-200 w-32 z-50">
                  <button
                    onClick={() => handleLogoOption("change")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => handleLogoOption("delete")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <span className="text-2xl font-bold text-blue-700">
              {user.clinicName || "Clinic Management"}
            </span>
          </div>

          <div className="relative ml-4">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-xl">👤</span>
              )}
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-md z-50">
                <button
                  onClick={() => profileInputRef.current.click()}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <span className="text-sm">📷</span> My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={profileInputRef}
              className="hidden"
              onChange={handleProfileUpload}
            />
          </div>

          <input
            type="file"
            accept="image/*"
            ref={logoInputRef}
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-28 max-w-7xl mx-auto px-6 space-y-6 pb-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user.ownerName || user.name || "Admin"}
            </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <p className="text-gray-600">
              <span className="font-semibold">Clinic:</span> {user.clinicName || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span> {user.phone || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Address:</span> {user.address || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Role:</span> {user.role || "N/A"}
            </p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <button
              onClick={handleCreateUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by email, name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Role</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Phone</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Clinic</th>
                    <th className="border border-gray-300 px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{u.email}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        {u.ownerName || u.name || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.role === "clinicAdmin" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">{u.phone || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-3">{u.clinicName || "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditUser(u._id)}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            title="Edit User"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(u)}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Create Clinic Website", desc: "Use available templates to create your clinic website." },
            { title: "Update Template", desc: "Modify the website template according to your requirements." },
            { title: "Upload Content", desc: "Upload medicine, doctor, staff profiles, branding, etc." },
            { title: "Online Appointment Scheduler", desc: "Schedule appointments online (Demo)." },
            { title: "Prescription Generator", desc: "Generate prescriptions quickly for patients." },
            { title: "Invoice / Bill Generator", desc: "Generate bills and invoices for services." },
            { title: "Patient Record Manager", desc: "Manage patient records (Lite Version)." },
            { title: "Clinic Profit Calculator", desc: "Calculate profit for your clinic easily." },
            { title: "Doctor Shift Planner", desc: "Plan doctor shifts efficiently." },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Modal (Create/Update) */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedUser ? "Update User" : "Create User"}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="clinicAdmin">Clinic Admin</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              {formData.role === "clinicAdmin" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Clinic Name</label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password {selectedUser && "(leave empty to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg pr-10"
                    required={!selectedUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {formData.role === "clinicAdmin" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {selectedUser ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete user: <strong>{selectedUser?.email}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
