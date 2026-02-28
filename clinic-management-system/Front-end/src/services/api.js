// Base URL of your backend server
const API_BASE_URL = "http://localhost:5000/api"; // ensure backend is running on port 5000

// Helper function for making API requests
const apiRequest = async (url, options = {}) => {
  try {
    // Get token from localStorage if available
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add Authorization header if token exists and not already set
    // Only add Bearer prefix if it's a JWT token (starts with 'ey' or is longer than 20 chars)
    if (token && !headers['Authorization']) {
      // Check if token is a JWT (JWT tokens typically start with 'ey' and are long)
      if (token.length > 20 && token.startsWith('ey')) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (token !== 'authenticated') {
        // For other tokens, still add Bearer prefix
        headers['Authorization'] = `Bearer ${token}`;
      }
      // If token is 'authenticated', don't add Authorization header (backward compatibility)
    }
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    let data;
    try {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          // If not JSON, use text as message
          data = { message: text };
        }
      } else {
        data = { message: "Empty response from server" };
      }
    } catch (e) {
      data = { message: "Failed to read response from server" };
    }

    if (!response.ok) {
      const error = {
        message: data.message || "Server Error",
        error: data.error || data.message || "Server Error",
        status: response.status
      };
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw { 
        message: "Failed to connect to server. Please make sure the backend server is running on http://localhost:5000", 
        error: "Connection Error",
        type: "network"
      };
    }
    
    // Handle other fetch errors
    if (error.message || error.error) {
      throw error;
    }
    
    throw { 
      message: "Network Error - Unable to reach the server", 
      error: "Network Error",
      type: "network"
    };
  }
};

// ✅ Register User (Clinic Admin or Patient)
export const registerUser = async (userData) => {
  return apiRequest(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// ✅ Login User
export const loginUser = async (credentials) => {
  return apiRequest(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// ✅ Logout User
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    // Only send Authorization header if token is a JWT
    const headers = {};
    if (token && token.length > 20 && token.startsWith('ey')) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return apiRequest(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
    });
  } catch (error) {
    // Even if logout fails, we should still clear local storage
    // This is handled in the component
    throw error;
  }
};

// ✅ Get All Users
export const getAllUsers = async () => {
  return apiRequest(`${API_BASE_URL}/user/all-user`, {
    method: 'GET',
  });
};

// ✅ Get Single User by ID
export const getUserById = async (userId) => {
  return apiRequest(`${API_BASE_URL}/user/get-user/${userId}`, {
    method: 'GET',
  });
};

// ✅ Update User
export const updateUser = async (userId, userData) => {
  return apiRequest(`${API_BASE_URL}/user/update-user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// ✅ Delete User
export const deleteUser = async (userId) => {
  return apiRequest(`${API_BASE_URL}/user/delete-user/${userId}`, {
    method: 'DELETE',
  });
};
