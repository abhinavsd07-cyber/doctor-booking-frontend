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

  // --- LOGIC: DATA FETCHING ---
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

  // --- UI: LOADING STATE ---
  if (!doctor) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Fetching Doctor Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        
        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: DOCTOR PROFILE STICKY SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-white sticky top-8">
              <div className="relative h-96 lg:h-[450px]">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">Verified Specialist</span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
                    <img src={assets.verified_icon} className="w-5 h-5" alt="" />
                  </div>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wide">{doctor.speciality}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Experience</p>
                    <p className="text-sm font-bold text-slate-700">{doctor.experience}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Fee</p>
                    <p className="text-sm font-bold text-slate-700">${doctor.fees}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    About
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed italic">
                    "{doctor.about}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING SYSTEM */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* DATE SECTION */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/50">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Select Date</h2>
                <p className="text-slate-400 text-sm">Choose your preferred day for the visit</p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {availableSlots.map((slots, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedDayIndex(index); setSelectedTime(""); }}
                    className={`flex-shrink-0 w-20 py-5 rounded-2xl transition-all duration-300 border-2 ${
                      selectedDayIndex === index
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105"
                        : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase mb-1">
                      {slots[0] && DAYS_OF_WEEK[slots[0].datetime.getDay()]}
                    </p>
                    <p className="text-xl font-black">
                      {slots[0] && slots[0].datetime.getDate()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* TIME SECTION */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/50">
               <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Available Slots</h2>
                <p className="text-slate-400 text-sm">Choose a time that works best for you</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableSlots[selectedDayIndex]?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(item.time)}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                      selectedTime === item.time
                        ? "bg-slate-900 border-slate-900 text-white shadow-md"
                        : "bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-blue-400"
                    }`}
                  >
                    {item.time.toLowerCase()}
                  </button>
                ))}
              </div>

              {/* BOOKING FOOTER */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Scheduled For</p>
                  <p className="text-slate-900 font-black text-lg">
                    {availableSlots[selectedDayIndex]?.[0]?.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {selectedTime ? ` at ${selectedTime}` : ' — Select Time'}
                  </p>
                </div>
                
                <button
                  onClick={handleBookAppointment}
                  className="w-full sm:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Confirm Appointment
                </button>
              </div>
            </div>

            {/* RELATED DOCTORS */}
            <div className="pt-10">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-lg font-bold text-slate-900">Similar Specialists</h3>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
              <RelatedDoctors docId={docId} speciality={doctor.speciality} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Appointment;