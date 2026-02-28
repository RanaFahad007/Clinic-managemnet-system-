import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/api"; // ✅ yeh line add ki

function Login({ onSwitch, onSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🧠 Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    try {
      const res = await loginUser({ email, password });

      if (res && res.success && res.user) {
        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(res.user));
        // Save JWT token if provided, otherwise use simple authentication flag
        localStorage.setItem("token", res.token || "authenticated");
        
        // Dispatch custom events to update Navbar immediately
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("authChange"));
        
        // Close modal first
        if (onSuccess) {
          onSuccess();
        }

        // Small delay to ensure modal closes, then navigate based on role
        setTimeout(() => {
          if (res.user.role === "clinicAdmin") {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      } else {
        setPasswordError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      const errorMessage = err.message || err.error || "Invalid credentials";
      const message = errorMessage.toLowerCase();

      // Check for network/connection errors
      if (err.type === "network" || message.includes("failed to connect") || message.includes("network error") || message.includes("fetch")) {
        setPasswordError("Cannot connect to server. Please make sure the backend is running on port 5000.");
        console.error("Network error:", err);
        return;
      }

      if (message.includes("email") || message.includes("not found") || message.includes("404")) {
        setEmailError("Incorrect email");
      } else if (message.includes("password") || message.includes("invalid") || message.includes("401")) {
        setPasswordError("Incorrect password");
      } else {
        setPasswordError(errorMessage);
      }
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`w-full p-3 rounded border ${
              emailError ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-green-500 outline-none`}
            required
          />
          {emailError && (
            <p className="text-red-600 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            className={`w-full p-3 rounded border ${
              passwordError ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-green-500 outline-none pr-10`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {passwordError && (
            <p className="text-red-600 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Don’t have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-green-600 font-semibold hover:underline"
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
