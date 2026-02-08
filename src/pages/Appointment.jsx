import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const SLOT_INTERVAL_MINUTES = 30;
const CLINIC_START_HOUR = 10;
const CLINIC_END_HOUR = 21;
const DAYS_TO_SHOW = 7;

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, backendURL, token, getDoctorsData } = useContext(AppContext);

  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [isChanging, setIsChanging] = useState(false); // For premium transition

  const loadDoctorDetails = useCallback(() => {
    const selectedDoctor = doctors.find((doc) => doc._id === docId);
    setDoctor(selectedDoctor || null);
  }, [doctors, docId]);

  const generateSlots = useCallback(() => {
    if (!doctor) return;

    const slotsByDay = [];
    const today = new Date();

    for (let dayOffset = 0; dayOffset < DAYS_TO_SHOW; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);

      const startTime = new Date(currentDate);
      const endTime = new Date(currentDate);
      endTime.setHours(CLINIC_END_HOUR, 0, 0, 0);

      if (dayOffset === 0) {
        const currentHour = today.getHours();
        startTime.setHours(
          currentHour >= CLINIC_START_HOUR ? currentHour + 1 : CLINIC_START_HOUR,
          today.getMinutes() > 30 ? 30 : 0, 0, 0
        );
      } else {
        startTime.setHours(CLINIC_START_HOUR, 0, 0, 0);
      }

      const daySlots = [];
      while (startTime < endTime) {
        const formattedTime = startTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const slotDateKey = `${startTime.getDate()}_${startTime.getMonth() + 1}_${startTime.getFullYear()}`;
        const isBooked = doctor.slots_booked?.[slotDateKey]?.includes(formattedTime);

        if (!isBooked) {
          daySlots.push({
            datetime: new Date(startTime),
            time: formattedTime,
          });
        }
        startTime.setMinutes(startTime.getMinutes() + SLOT_INTERVAL_MINUTES);
      }
      slotsByDay.push(daySlots);
    }
    setAvailableSlots(slotsByDay);
  }, [doctor]);

  const handleDayChange = (index) => {
    setIsChanging(true);
    setSelectedDayIndex(index);
    setSelectedTime("");
    setTimeout(() => setIsChanging(false), 300); // Duration of fade-in
  };

  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }
    if (!selectedTime) return toast.info("Please select a time slot");

    try {
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + selectedDayIndex);
      const slotDate = `${appointmentDate.getDate()}_${appointmentDate.getMonth() + 1}_${appointmentDate.getFullYear()}`;

      const { data } = await axios.post(`${backendURL}/api/user/book-appointment`,
        { docId, slotDate, slotTime: selectedTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        setTimeout(() => navigate("/my-appointments"), 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };

  useEffect(() => { loadDoctorDetails(); }, [loadDoctorDetails]);
  useEffect(() => { generateSlots(); }, [generateSlots]);

  if (!doctor) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* --- DOCTOR HERO SECTION --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-24">
          <div className="w-full lg:w-1/3 group">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all duration-700 group-hover:scale-[1.03]">
              <img src={doctor.image} alt={doctor.name} className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2.5 rounded-2xl shadow-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-white">Active Now</span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-8 py-4">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">{doctor.name}</h1>
                <img src={assets.verified_icon} className="w-10 h-10 shadow-sm" alt="Verified" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-indigo-600 text-white px-6 py-2 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 uppercase tracking-wider">
                  {doctor.speciality}
                </span>
                <span className="bg-white text-slate-500 px-6 py-2 rounded-2xl text-sm font-bold border border-slate-100 shadow-sm">
                  {doctor.degree} • {doctor.experience}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
               <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600 mb-6 flex items-center gap-3">
                 <span className="w-10 h-[2px] bg-indigo-600" /> Professional Bio
               </h3>
               <p className="text-slate-500 leading-relaxed text-xl font-medium leading-relaxed italic">"{doctor.about}"</p>
               
               <div className="mt-12 pt-10 border-t border-slate-50 flex items-center justify-between">
                 <div>
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">Private Consultation</p>
                    <p className="text-5xl font-black text-slate-900 mt-2 tracking-tight">${doctor.fees}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">Primary Clinic</p>
                    <p className="text-slate-900 font-bold text-lg mt-2 italic">Elite Health Pavilion</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- CENTERED BOOKING SECTION --- */}
        <div className="max-w-5xl mx-auto py-20 bg-white/40 rounded-[3rem] backdrop-blur-sm border border-white/60">
          <div className="text-center mb-16 px-6">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Reserve Your Presence</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full mb-4" />
            <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs">Curated Time Slots Just For You</p>
          </div>

          {/* Centered Date Selector */}
          <div className="flex justify-center md:justify-center gap-6 overflow-x-auto pb-10 no-scrollbar snap-x px-8">
            {availableSlots.map((slots, index) => (
              <button
                key={index}
                onClick={() => handleDayChange(index)}
                className={`snap-center min-w-[110px] py-8 rounded-[2.5rem] flex flex-col items-center transition-all duration-500 transform
                ${selectedDayIndex === index 
                  ? "bg-slate-900 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] -translate-y-2 scale-110" 
                  : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-200 hover:shadow-lg"}`}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                  {slots[0] && DAYS_OF_WEEK[slots[0].datetime.getDay()]}
                </span>
                <span className="text-3xl font-black">
                  {slots[0] && slots[0].datetime.getDate()}
                </span>
              </button>
            ))}
          </div>

          {/* Centered Time Grid with Fade Animation */}
          <div className={`flex justify-center transition-all duration-300 ${isChanging ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full max-w-4xl px-8 mt-8">
              {availableSlots[selectedDayIndex]?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2
                  ${selectedTime === slot.time
                    ? "bg-indigo-600 text-white border-transparent shadow-2xl shadow-indigo-300 scale-105"
                    : "bg-white text-slate-500 border-slate-100 hover:border-indigo-600 hover:text-indigo-600"}`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Call to Action */}
          <div className="mt-20 flex flex-col items-center">
            <button
              onClick={handleBookAppointment}
              className="group px-24 py-7 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-[0.3em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:bg-indigo-700 hover:-translate-y-2 transition-all duration-500 active:scale-95 flex items-center gap-4"
            >
              Book Now
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
            <div className="flex items-center gap-2 mt-8">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">Instant confirmation via email</p>
            </div>
          </div>
        </div>

        {/* --- RELATED SECTION --- */}
        <div className="mt-40">
          <div className="flex items-center gap-6 mb-12">
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter shrink-0">Similar Specialists</h4>
            <div className="h-[2px] w-full bg-slate-100" />
          </div>
          <RelatedDoctors docId={docId} speciality={doctor.speciality} />
        </div>
      </div>
    </div>
  );
};

export default Appointment;