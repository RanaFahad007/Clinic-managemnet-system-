import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteUser } from "../services/api";

function Hero({ onBookClick, title = "Welcome to MyClinic", subtitle = "Your health, our priority. Book your appointment online.", imageSrc = "/doctors.jpg", imageAlt = "Doctor with patient" }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    clinicName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    // Listen for auth changes
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleUpdateClick = () => {
    if (user) {
      setFormData({
        ownerName: user.ownerName || "",
        clinicName: user.clinicName || "",
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        address: user.address || ""
      });
      setFormErrors({});
      setShowUpdateModal(true);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      if (!user || !user._id) {
        throw new Error("User ID not found");
      }

      const updateData = { ...formData };
      // Remove password if empty (don't update it)
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await updateUser(user._id, updateData);
      
      if (response && response.success) {
        // Update localStorage with new user data
        const updatedUser = response.user || { ...user, ...updateData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Update local state
        setUser(updatedUser);
        
        // Trigger auth change event to update other components
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("authChange"));
        
        // Close modal and show success
        setShowUpdateModal(false);
        alert("Profile updated successfully!");
      } else {
        setFormErrors({ submit: response?.message || "Failed to update profile. Please try again." });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage = error?.message || error?.error || "Failed to update profile. Please try again.";
      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !user._id) {
      alert("User ID not found. Cannot delete account.");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await deleteUser(user._id);
      
      if (response && response.success) {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Update local state
        setUser(null);
        setIsLoggedIn(false);
        
        // Trigger auth change events to update other components
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("authChange"));
        
        // Close modal
        setShowDeleteModal(false);
        
        // Show success message and redirect
        alert("Your account has been deleted successfully.");
        navigate("/", { replace: true });
      } else {
        alert(response?.message || "Failed to delete account. Please try again.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage = error?.message || error?.error || "Failed to delete account. Please try again.";
      alert(errorMessage);
      setIsDeleting(false);
    }
  };

  return (
    <section
      id="home" // Ensure this ID matches Navbar's to="home"
      className="flex flex-col md:flex-row justify-between items-center gap-10 bg-green-50 px-12 py-20 mt-14 scroll-mt-20" // scroll-mt-20 for smooth scroll offset
      aria-labelledby="hero-title"
    >
      <div className="max-w-lg">
        <h1 id="hero-title" className="text-4xl font-bold text-green-600 mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-800 mb-6">
          {subtitle}
        </p>
        {!isLoggedIn ? (
          <button
            onClick={onBookClick}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md font-bold hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Log in"
          >
            LOGIN <ArrowRight size={20} />
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/services")}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="View Services"
              >
                View Services <ArrowRight size={20} />
              </button>
              <button
                onClick={handleUpdateClick}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-md font-bold hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Update Profile"
              >
                Update Profile
              </button>
            </div>
            <button
              onClick={handleDeleteClick}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Delete Account"
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        )}
      </div>
      <div className="relative">
        {imageError ? (
          <div className="w-[450px] h-[300px] bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-gray-500">Image not available</p>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="w-[450px] h-[300px] bg-gray-200 rounded-lg shadow-lg animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            )}
            <img
              src={imageSrc}
              alt={imageAlt}
              className={`w-[450px] rounded-lg shadow-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        )}
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-[500px] max-w-[90%] max-h-[90vh] overflow-auto shadow-2xl relative">
            <button
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-transform hover:scale-110 z-50"
              onClick={() => setShowUpdateModal(false)}
            >
              <X size={18} />
            </button>
            
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
              Update Your Profile
            </h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {user?.role === "clinicAdmin" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Owner Name</label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Clinic Name</label>
                    <input
                      type="text"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Password (leave empty to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              {user?.role === "clinicAdmin" && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                    rows="3"
                  />
                </div>
              )}

              {formErrors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {formErrors.submit}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-[500px] max-w-[90%] shadow-2xl relative">
            <button
              className="absolute top-3 right-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-transform hover:scale-110 z-50"
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              <X size={18} />
            </button>
            
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Account
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This will permanently delete your account and all associated data from the database. You will be logged out immediately.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">⏳</span> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} /> Yes, Delete My Account
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
