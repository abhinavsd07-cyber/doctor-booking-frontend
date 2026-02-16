import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments"; 
import Appointment from "./pages/Appointment";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Navbar is Fixed inside the component */}
      <Navbar />

      {/* 🚀 THE FIX: 'pt-28' creates the space so the Header doesn't collapse under the Navbar */}
      <main className="mx-4 sm:mx-[10%] pt-24 md:pt-32 pb-10 transition-all duration-500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
        </Routes>
      </main>

      <div className="mx-4 sm:mx-[10%]">
        <Footer />
      </div>
    </div>
  );
};

export default App;