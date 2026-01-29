import React from "react";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800" id="speciality">
      <h1 className="text-3xl font-medium">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      
      {/* Added overflow-x-scroll for mobile swipe and scrollbar-hide for a cleaner look */}
      <div className="flex sm:justify-center gap-6 pt-5 w-full overflow-x-scroll no-scrollbar">
        {specialityData.map((item, index) => (
          <Link 
            key={index} 
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            to={`/doctors/${item.speciality}`} 
            onClick={() => scrollTo(0, 0)}
            style={{textDecoration:"none"}}
          >
            <img
              src={item.image}
              alt={item.speciality}
              className="w-16 sm:w-24 mb-2"
            />
            <h6 className="text-black text-xs font-medium">{item.speciality}</h6>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;