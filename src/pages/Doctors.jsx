import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterDoc, setFilterDoc] = useState([]);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialties = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <h3 className="text-2xl font-semibold text-blue-400">Available Specialists</h3>
      <p className="text-gray-500 mt-1">Browse through our certified doctors by specialty.</p>
      
      <div className="flex flex-col lg:flex-row items-start gap-8 mt-8">
        
        {/* Sidebar Filters */}
        <div className={`flex-col gap-3 min-w-[240px] transition-all duration-300 ${showFilter ? 'flex w-full' : 'hidden lg:flex'}`}>
          <p className="hidden lg:block text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Filter by Specialty</p>
          {specialties.map((item) => (
            <p
              key={item}
              onClick={() => speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)}
              className={`pl-4 py-2.5 pr-12 border border-gray-200 rounded-md cursor-pointer transition-all duration-200 hover:border-primary hover:bg-blue-50/50 ${
                speciality === item ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium" : "text-gray-600"
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        {/* Doctor List Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative overflow-hidden bg-blue-50">
                   <img className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110" src={item.image} alt={item.name} />
                </div>
                
                <div className="p-4">
                  {/* FIXED: Conditional Availability Logic */}
                  <div className={`flex items-center gap-2 text-xs font-medium mb-2 ${item.available ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="relative flex h-2 w-2">
                      {item.available && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    {item.available ? 'Available' : 'Not Available'}
                  </div>
                  
                  <p className="text-black text-xl">{item.name}</p>
                  <p className="text-gray-500 text-sm mt-1">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 text-lg">No doctors found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;