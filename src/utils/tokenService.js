// tokenService.js

// Set the token in localStorage
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token); // Use a descriptive key
  }
};

// Get the token from localStorage
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem("authToken");
};

// Clear all localStorage data (if needed)
export const clearTokenStorage = () => {
  localStorage.clear();
};
