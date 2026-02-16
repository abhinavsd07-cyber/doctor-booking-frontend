import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="mx-6 md:mx-10 mt-10 mb-0">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] rounded-[2.5rem] px-8 md:px-12 lg:px-20 min-h-[600px] flex items-center shadow-[0_25px_60px_-15px_rgba(37,99,235,0.3)] z-10 font-sans">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
          
          {/* --------- Left Side (Text Content) --------- */}
          <div className="md:w-1/2 flex flex-col items-start gap-8 pt-16 pb-12 z-10">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] text-white font-bold tracking-tight leading-[1.1]">
                Experience <br />
                <span className="text-blue-200">Elite Care.</span>
              </h1>
              <p className="text-base md:text-lg text-blue-50/90 font-medium max-w-md leading-relaxed">
                Access an exclusive network of world-class specialists with our
                intelligent, seamless booking experience.
              </p>
            </div>

            {/* Glassmorphism Profile Feature */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-3 pr-8 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20">
              <img className="w-20 drop-shadow-2xl" src={assets.group_profiles} alt="Community" />
              <p className="text-white text-[10px] font-semibold tracking-wide uppercase leading-tight">
                Join <span className="text-blue-200 font-bold">12K+</span> users{" "}
                <br className="hidden lg:block" />
                consulting top-tier doctors.
              </p>
            </div>
            
            <a
              href="#speciality"
              className="group relative inline-flex items-center gap-4 bg-white px-10 py-4 text-blue-600 font-bold text-sm tracking-widest uppercase shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:bg-slate-900 hover:text-white transition-all duration-500 active:scale-95 rounded-full"
            >
              Book Appointment
              <img className="w-3 group-hover:translate-x-1 transition-transform invert-0 group-hover:invert" src={assets.arrow_icon} alt="" />
            </a>
          </div>

          {/* --------- Right Side (Large Image) --------- */}
          {/* Changed md:w-2/5 to md:w-1/2 to give the image more room */}
          <div className="md:w-1/2 relative flex justify-center md:justify-end items-end self-end h-full">
            {/* Background Aura for the Image */}
            <div className="absolute bottom-0 right-0 bg-blue-400/30 blur-[120px] w-full h-full rounded-full transform translate-y-20 scale-110"></div>

            <img
              className="w-full md:w-[115%] max-w-[550px] md:max-w-none h-auto object-contain z-10 
                         drop-shadow-[-30px_30px_60px_rgba(0,0,0,0.4)] 
                         md:scale-110 md:translate-y-5 transition-transform duration-700 hover:scale-[1.12]"
              src={assets.Header_img1}
              alt="Medical Specialists"
            />
          </div>

        </div>
      </section>
    </div>
  );
};

export default Header;