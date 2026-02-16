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

  if (!doctor) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-semibold">Fetching Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: DOCTOR PROFILE CARD */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 sticky top-8">
              <div className="relative h-[400px]">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Available</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
                    <img src={assets.verified_icon} className="w-5 h-5" alt="" />
                  </div>
                  <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest">{doctor.speciality}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] uppercase text-slate-400 font-bold mb-1">Exp.</p>
                    <p className="text-sm font-bold text-slate-800">{doctor.experience}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[9px] uppercase text-slate-400 font-bold mb-1">Fee</p>
                    <p className="text-sm font-bold text-slate-800">${doctor.fees}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Background</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {doctor.about}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING SYSTEM */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* DATE PICKER */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Select Date</h2>
                <div className="h-1 w-12 bg-blue-600 rounded-full mt-2"></div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {availableSlots.map((slots, index) => (
                  <button
                    key={index}
                    onClick={() => { setSelectedDayIndex(index); setSelectedTime(""); }}
                    className={`flex-shrink-0 w-20 py-4 rounded-2xl transition-all border-2 ${
                      selectedDayIndex === index
                        ? "bg-green-900 border-slate-100 text-white"
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase mb-1">
                      {slots[0] && DAYS_OF_WEEK[slots[0].datetime.getDay()]}
                    </p>
                    <p className="text-xl font-bold">
                      {slots[0] && slots[0].datetime.getDate()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* TIME PICKER */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Available Time</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableSlots[selectedDayIndex]?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTime(item.time)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                      selectedTime === item.time
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-slate-50 border-transparent text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    {item.time}
                  </button>
                ))}
              </div>

              {/* FOOTER ACTION */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Selected Slot</p>
                  <p className="text-slate-900 font-bold text-base">
                    {availableSlots[selectedDayIndex]?.[0]?.datetime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {selectedTime ? ` @ ${selectedTime}` : ' (Please select time)'}
                  </p>
                </div>
                
                <button
                  onClick={handleBookAppointment}
                  className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 text-white font-bold text-sm hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-blue-100"
                  style={{ borderRadius: "50px" }}
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {/* RELATED SECTION */}
            <div className="pt-6">
              <RelatedDoctors docId={docId} speciality={doctor.speciality} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Appointment;