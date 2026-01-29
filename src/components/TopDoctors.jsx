import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext"; // Ensure the path casing is correct

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-semibold text-gray-800">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-500">
        Simply browse through our extensive list of trusted doctors and book your appointment hassle-free.
      </p>

      {/* Modern Grid System */}
      <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5 px-3 sm:px-0">
        {/* We use doctors.slice(0, 10) to show the top 10 from your database */}
        {doctors && doctors.length > 0 ? (
          doctors.slice(0, 5).map((item, index) => (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
              className="border border-blue-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-500 bg-white group"
              key={item._id || index} // Use MongoDB _id as the key
            >
              <div className="bg-blue-50 overflow-hidden">
                  <img className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-500" src={item.image} alt={item.name} />
              </div>
              
              <div className="p-5">
                <div className={`flex items-center gap-2 text-sm font-medium mb-2 ${item.available ? 'text-green-500' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  <p>{item.available ? 'Available' : 'Unavailable'}</p>
                </div>

                <p className="text-gray-900 text-lg font-bold truncate">{item.name}</p>
                <p className="text-blue-600 text-sm font-medium">{item.speciality}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 py-10">No doctors found. Please check your backend connection.</p>
        )}
      </div>

      <button
        onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
        className="mt-10 px-12 py-3 bg-blue-50 text-blue-700 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-100"
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;