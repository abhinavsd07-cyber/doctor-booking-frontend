import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { motion } from "framer-motion";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  // Animation variants for a premium entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    /* SPACE FIX: 
       - mt-0: Connects directly to the SpecialityMenu above.
       - mb-14: Reduced from 24 to bring the Banner section closer.
       - gap-6: Tightens the vertical space between Title, Grid, and Button.
    */
    <div className="flex flex-col items-center gap-6 mt-0 mb-14 md:mx-10 font-sans" id="top-doctors">
      
      {/* --- Section Header --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
          Top <span className="text-blue-600">Specialists</span>
        </h1>
        <p className="max-w-xl mx-auto text-slate-500 text-xs md:text-sm font-medium leading-relaxed px-6">
          Access our highest-rated medical professionals for expert clinical care 
          and personalized consultations.
        </p>
      </motion.div>

      {/* --- The Grid --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        /* pt-0 removes the gap between the paragraph and the first row of cards */
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 pt-0 px-4 sm:px-0"
      >
        {doctors && doctors.length > 0 ? (
          doctors.slice(0, 5).map((item, index) => (
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10 }}
              key={item._id || index}
              className="group rounded-[2rem] overflow-hidden cursor-pointer bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] transition-all duration-500"
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0); }}
            >
              {/* Doctor Image Container */}
              <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover object-top" 
                  src={item.image} 
                  alt={item.name} 
                />
                
                {/* Availability Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-white/90 border border-white/20 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {item.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="p-6">
                <div className="flex flex-col gap-1">
                  <h5 className="text-slate-900 text-lg font-bold tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h5>
                  <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                    {item.speciality}
                  </p>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">View Profile</span>
                   <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse text-xs">Synchronizing Experts...</p>
          </div>
        )}
      </motion.div>

      {/* --- Footer Button --- */}
      {/* mt-2 pulls this button closer to the bottom of the card grid */}
      <button
        onClick={() => { navigate('/doctors'); window.scrollTo(0, 0); }}
        className="mt-2 px-12 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 shadow-xl active:scale-95"
        style={{ borderRadius: "50px" }}
      >
        Discover All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;