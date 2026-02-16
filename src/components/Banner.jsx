import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    /* ADJUSTED: Changed 'my-24' to 'mt-0 mb-20' to close the gap with TopDoctors */
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] mt-0 mb-20 md:mx-10 shadow-2xl shadow-blue-200 font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

      <div className="flex flex-col md:flex-row items-center px-8 sm:px-12 md:px-16 lg:px-20">
        
        {/* --------- Left Content Section --------- */}
        {/* ADJUSTED: Reduced py-32 to py-20 to keep the banner height sleek */}
        <div className="flex-1 py-12 sm:py-16 md:py-20 z-10 text-center md:text-left">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Book <span className="text-blue-200">Appointment</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-50 opacity-90 tracking-tight">
              With 100+ Trusted Doctors
            </p>
          </div>
          
          <p className="mt-6 text-blue-100/80 text-sm md:text-base max-w-md font-medium leading-relaxed hidden sm:block">
            Take the first step towards better health. Join our community to access 
            personalized care from certified specialists.
          </p>

          <button 
            onClick={() => { navigate("/login"); window.scrollTo(0, 0); }} 
            className="group relative bg-slate-900 text-white text-xs sm:text-sm font-bold uppercase tracking-widest px-10 py-4 mt-8 transition-all duration-300 active:scale-95 shadow-xl hover:text-blue-600"
            style={{ borderRadius: "50px" }}
          >
            Create account
          </button>
        </div>

        {/* --------- Right Visual Section --------- */}
        <div className="hidden md:block md:w-1/2 lg:w-[380px] relative self-end">
          <img 
            className="w-full h-auto drop-shadow-[-20px_20px_30px_rgba(0,0,0,0.2)]" 
            src={assets.appointment_img} 
            alt="Medical Professional" 
          />
        </div>

      </div>
    </div>
  );
};

export default Banner;