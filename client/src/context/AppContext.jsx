import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

// --- CRITICAL FIX: Global function to set the Authorization header ---
// This function ensures the token is always in the required 'Bearer' format.
const setAuthHeader = (token) => {
    if (token) {
        // Sets the standard Authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Clears the header on logout
        delete axios.defaults.headers.common['Authorization'];
    }
};
// --- END CRITICAL FIX ---


const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // New function to update token state AND set the global header
  const updateTokenAndHeader = (newToken) => {
      setToken(newToken);
      setAuthHeader(newToken);
  }

  // --- MODIFIED: Removed custom header usage from all protected calls ---
  const loadCreditsData = async () => {
    try {
      // Header is now handled globally via setAuthHeader
      const { data } = await axios.get(backendUrl + "/api/user/credits"); 
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const generateImage = async (prompt) => {
    try {
      // Header is now handled globally
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt }
        // Headers object omitted
      );
      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditsData();
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // --- END MODIFIED REQUESTS ---

  const logout = () => {
    localStorage.removeItem("token");
    updateTokenAndHeader(""); // Use the new update function to clear header
    setUser(null);
  };

  // --- MODIFIED: useEffect to load token and set header on app mount ---
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
        updateTokenAndHeader(existingToken);
        // loadCreditsData() is handled by the dependency array below, but we can call it here too.
    }
  }, []); // Run only once on mount
  
  // Existing useEffect logic remains critical for reloading data after login/token change
  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);


  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken: updateTokenAndHeader, // Use the updated function here
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;