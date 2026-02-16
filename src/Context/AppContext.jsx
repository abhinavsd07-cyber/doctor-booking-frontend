import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [userData, setUserData] = useState(false);

  // --- Fetch Doctors Data ---
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error("Unable to refresh doctors list");
      }
    } catch (error) {
      console.error("API Error (Doctors):", error.message);
      toast.error("Network error: Please try again later.");
    }
  };

  // --- Load User Profile Data ---
  const loadUserProfileData = async () => {
    try {
      const currentToken = token || localStorage.getItem('token');
      if (!currentToken) return;

      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, {
        headers: { token: currentToken },
      });

      if (data.success) {
        // Deep copy to ensure state reference change
        setUserData({ ...data.userData });
      } else {
        // If token is invalid/expired, clear it
        if (data.message === "Unauthorized") {
           logout();
        }
        toast.error(data.message);
      }
    } catch (error) {
      console.error("API Error (User):", error);
      toast.error("Session expired or connection lost.");
    }
  };

  // --- Shared Value Object ---
  const value = {
    doctors,
    getDoctorsData,
    backendURL,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  // Initial Load: Doctors
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Effect: Sync User Data on Token Change
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;