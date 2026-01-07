import api from "./api"; // Use the main API service which includes auth headers

// For ML services, we'll use the same base API service which now handles ML requests through the backend proxy
export default api;