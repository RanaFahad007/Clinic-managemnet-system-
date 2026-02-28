 import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

 const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
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
  }, []);

  // Listen for storage changes (when login/logout happens)
  useEffect(() => {
    const handleStorageChange = () => {
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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);
    // Also check on focus in case of same-tab changes
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("focus", handleStorageChange);
    };
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
      setIsLoggedIn(false);
      setUser(null);
      // Trigger events to update other components
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("authChange"));
      navigate("/", { replace: true });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* ✅ Left side: Logo + MyClinic text */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MiIgaGVpZ2h0PSI3MiIgdmlld0JveD0iMCAwIDcyIDcyIj48ZyBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjIuNSAxMmgyN3Y0OGgtMjd6bS05IDEzaDl2MzVoLTl6bTM2IDBoOXYzNWgtOXoiLz48cGF0aCBmaWxsPSIjOTJkM2Y1IiBkPSJNMjkuNSA0NGgxM3YxNmgtMTN6Ii8+PHBhdGggZmlsbD0iI2VhNWE0NyIgZD0iTTQzLjUgMjNoLTV2LTVoLTV2NWgtNXY1aDV2NWg1di01aDV6Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTJkM2Y1IiBkPSJNMTcgMzBoMnY1aC0yem0wIDEwaDJ2NWgtMnptMCAxMGgydjVoLTJ6bTM2LTIwaDJ2NWgtMnptMCAxMGgydjVoLTJ6bTAgMTBoMnY1aC0yeiIvPjwvZz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yMi41IDEyaDI3djQ4aC0yN3ptLTkgMTNoOXYzNWgtOXptMzYgMGg5djM1aC05eiIvPjxwYXRoIGQ9Ik0yOS41IDQ0aDEzdjE2aC0xM3pNMzYgNjBWNDRtNy41LTIxaC01di01aC01djVoLTV2NWg1djVoNXYtNWg1ek0xOSAzNWgtMnYtNW0yIDE1aC0ydi01bTIgMTVoLTJ2LTVtMzgtMTVoLTJ2LTVtMiAxNWgtMnYtNW0yIDE1aC0ydi01Ii8+PC9nPjwvc3ZnPg=="
              alt="MyClinic Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-green-600">MyClinic</h1>
          </Link>
        </div>

        {/* ✅ Right side: Navigation links */}
        <div className="flex items-center gap-6">
          <ul className="flex gap-8 font-semibold text-gray-800 items-center">
            <li className="cursor-pointer hover:text-green-500 transition">
              <Link to="/">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="cursor-pointer hover:text-green-500 transition">
                  <Link to="/services">Services</Link>
                </li>
                <li className="cursor-pointer hover:text-green-500 transition">
                  <Link to="/medical">Medical</Link>
                </li>
                <li className="cursor-pointer hover:text-green-500 transition">
                  <Link to="/about">About</Link>
                </li>
                <li className="cursor-pointer hover:text-green-500 transition">
                  <Link to="/contact">Contact</Link>
                </li>
                {user?.role === "clinicAdmin" && (
                  <li className="cursor-pointer hover:text-green-500 transition">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                )}
              </>
            )}
          </ul>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.ownerName || user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Please login to access services
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
