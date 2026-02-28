import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/api"; // ✅ backend function import kiya

function Register({ onSwitch }) {
  const [form, setForm] = useState({
    ownerName: "",
    clinicName: "",
    email: "",
    password: "",
    role: "clinicAdmin", // default role
    phone: "",
    address: "",
    name: "", // patient name
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (form.role === "clinicAdmin") {
      if (!form.ownerName.trim()) e.ownerName = "Enter admin full name";
      if (!form.clinicName.trim()) e.clinicName = "Enter clinic name";
      if (!form.email.trim()) e.email = "Enter email";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter valid email";
      if (!form.password) e.password = "Enter password";
      else if (form.password.length < 5)
        e.password = "Password must be at least 5 characters";
      if (!form.phone) e.phone = "Enter phone number";
      else if (!/^\d+$/.test(form.phone))
        e.phone = "Phone must contain only digits";
      else if (form.phone.length > 11)
        e.phone = "Enter valid phone number (max 11 digits)";
      if (!form.address.trim()) e.address = "Enter address";
    } else if (form.role === "patient") {
      if (!form.name.trim()) e.name = "Enter your full name";
      if (!form.email.trim()) e.email = "Enter email";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter valid email";
      if (!form.password) e.password = "Enter password";
      else if (form.password.length < 5)
        e.password = "Password must be at least 5 characters";
      if (!form.phone) e.phone = "Enter phone number";
      else if (!/^\d+$/.test(form.phone))
        e.phone = "Phone must contain only digits";
      else if (form.phone.length > 11)
        e.phone = "Enter valid phone number (max 11 digits)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm((p) => ({ ...p, [name]: digitsOnly.slice(0, 11) }));
      setErrors((p) => ({ ...p, phone: undefined }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
      setErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  // ✅ Backend connection here
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload =
        form.role === "clinicAdmin"
          ? {
              ownerName: form.ownerName,
              clinicName: form.clinicName,
              email: form.email,
              password: form.password,
              role: form.role,
              phone: form.phone,
              address: form.address,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
              phone: form.phone,
            };

      // ✅ Using backend service function instead of axios
      const data = await registerUser(payload);

      if (data.error) {
        setErrors((p) => ({ ...p, submit: data.error }));
      } else {
        alert("✅ Registration successful! Please login.");
        onSwitch?.(); // toggle to login form
      }
    } catch (err) {
      setErrors((p) => ({ ...p, submit: "Registration failed" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="clinicAdmin">Clinic Admin</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        {/* Dynamic Form Fields */}
        {form.role === "clinicAdmin" ? (
          <>
            <div>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Admin / Owner Full Name"
                className={`w-full p-3 rounded border ${
                  errors.ownerName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 outline-none`}
                required
              />
              {errors.ownerName && (
                <p className="text-red-600 text-sm mt-1">{errors.ownerName}</p>
              )}
            </div>

            <div>
              <input
                name="clinicName"
                value={form.clinicName}
                onChange={handleChange}
                placeholder="Clinic Name"
                className={`w-full p-3 rounded border ${
                  errors.clinicName ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 outline-none`}
                required
              />
              {errors.clinicName && (
                <p className="text-red-600 text-sm mt-1">{errors.clinicName}</p>
              )}
            </div>

            <div>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className={`w-full p-3 rounded border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 outline-none`}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </>
        ) : (
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full p-3 rounded border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-green-500 outline-none`}
              required
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        )}

        <div>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className={`w-full p-3 rounded border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-green-500 outline-none`}
            required
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password with eye toggle */}
        <div className="relative">
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            className={`w-full p-3 rounded border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-green-500 outline-none pr-10`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (digits only, max 11)"
            className={`w-full p-3 rounded border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-green-500 outline-none`}
            inputMode="numeric"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition disabled:opacity-50"
        >
          {submitting ? "Registering..." : "Register"}
        </button>

        {errors.submit && (
          <p className="text-red-600 text-sm mt-2 text-center">
            {errors.submit}
          </p>
        )}

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => onSwitch?.()}
            className="text-green-600 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
