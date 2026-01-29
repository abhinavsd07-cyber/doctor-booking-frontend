import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [doctors, setDoctors] = useState([]);
  // Add these to your existing AppContext.jsx state
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(false);

  // 1. DEFINE the function first
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/list`);
      if (data.success) {
        toast.success(data.message);
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
        toast.error("Could not fetch doctors data");
      }
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      toast.error(error.message);
    }
  };
  // API to load user profile using the token
 const loadUserProfileData = async () => {
    try {
      // It's safer to use the token directly from localStorage if state is lagging
      const currentToken = token || localStorage.getItem('token');
      
      if (!currentToken) return;

      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, {
        headers: { token: currentToken },
      });

      if (data.success) {
        // We spread the data to ensure React detects a fresh object reference
        setUserData({ ...data.userData });
        console.log("Updated UI with:", data.userData.phone);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // 3. ASSIGN to the value object (After both are ready)
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

  // 2. CALL the function in useEffect (After it is defined)
  useEffect(() => {
    getDoctorsData();
  }, []);
  // Load profile whenever token changes
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
