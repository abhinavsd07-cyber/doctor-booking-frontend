import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      /* ADJUSTED: Reduced py-24 to pt-12 pb-14 to kill the massive gap */
      className="flex flex-col items-center gap-6 pt-12 pb-14 text-slate-800 font-sans bg-white"
      id="speciality"
    >
      {/* --- Section Header --- */}
      <div className="text-center space-y-3 px-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
          Find by <span className="text-blue-600">Speciality</span>
        </h1>
        <p className="max-w-xl mx-auto text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
          Select a department to browse our network of certified specialists.
        </p>
      </div>

      {/* --- Specialty Grid --- */}
      {/* ADJUSTED: Reduced pt-12 to pt-8 */}
      <div className="flex sm:justify-center items-center gap-8 pt-8 w-full overflow-x-auto no-scrollbar px-6 sm:px-10">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group flex flex-col items-center flex-shrink-0 transition-all duration-500"
            style={{ textDecoration: "none" }}
          >
            {/* ICON CONTAINER */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 flex items-center justify-center bg-slate-50 rounded-[2.5rem] border border-slate-100 group-hover:bg-white group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] group-hover:border-blue-100 group-hover:-translate-y-2 transition-all duration-500">
              
              <div className="absolute inset-4 rounded-[1.5rem] bg-blue-100/0 group-hover:bg-blue-50/50 transition-all duration-500 blur-xl"></div>

              <img
                src={item.image}
                alt={item.speciality}
                className=" w-12 sm:w-14 z-10 transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* LABEL */}
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800 group-hover:text-blue-600 transition-colors duration-300">
              {item.speciality}
            </span>

            {/* Indicator Dot */}
            <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;