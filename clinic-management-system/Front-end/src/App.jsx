import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./index.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Coreservices from "./components/Coreservices";
import MedicalServices from "./components/MedicalServices";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";  

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const location = useLocation();

  const handleLoginSuccess = () => {
    setShowLogin(false); // close popup automatically
  };

  // Close modal if user is logged in or on dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if ((token && user) || location.pathname === "/dashboard") {
      setShowLogin(false);
    }
  }, [location.pathname]);

  return (
    <div className="font-sans bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen text-gray-800">
      <Navbar />

      <Routes>
         <Route path="/" element={<Hero onBookClick={() => {
          setShowLogin(true);
          setIsRegistering(false); // always open login first
        }} />} />
        {/* ✅ Protect all service routes - require login */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Coreservices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical"
          element={
            <ProtectedRoute>
              <MedicalServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
         {/* ✅ Dashboard route protected - requires admin */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
      </Routes>
        {location.pathname !== "/dashboard" && <Footer />}
       

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl w-[420px] max-w-[90%] max-h-[90vh] shadow-2xl relative overflow-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-transform hover:scale-110  z-50"
                onClick={() => setShowLogin(false)}
              >
                ✖
              </button>
                 <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
                {isRegistering ? "Create an Account 🩺" : "Welcome Back 👋"}
              </h2>
               {/* Toggle between Login and Register */}
              {isRegistering ? (
                <Register onSwitch={() => setIsRegistering(false)} />
              ) : (
                <Login onSwitch={() => setIsRegistering(true)} 
                onSuccess={handleLoginSuccess}/>
              )}
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

