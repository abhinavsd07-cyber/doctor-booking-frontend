import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, backendURL, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  

  // Fetch Doctor Information from global state
  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId);
    setDocInfo(doc);
  };

  // Logic to generate slots for the next 7 days
  const getAvailableSlots = async () => {
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;

        // Check if slot is already booked in backend
        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(formattedTime) ? false : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => ([...prev, timeSlots]));
    }
  };

  // Function to book appointment
  const bookAppointment = async () => {
        if (!token) {
            toast.warn("Please login to book an appointment");
            return navigate("/login");
        }

        if (!slotTime) {
            return toast.info("Please select a time slot");
        }

        try {
            // Logic to calculate the correct date based on slotIndex
            const today = new Date();
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + slotIndex);

            const day = targetDate.getDate();
            const month = targetDate.getMonth() + 1;
            const year = targetDate.getFullYear();

            const slotDate = `${day}_${month}_${year}`;

            const { data } = await axios.post(
                backendURL + "/api/user/book-appointment",
                { docId, slotDate, slotTime },
                { headers: { token } }
            );

           if (data.success) {
        // 1. Show the toast immediately
        toast.success(data.message);

        // 2. Update the slots in the background
        getDoctorsData();

        // 3. WAIT for 1 second (1000ms) before navigating.
        // This is the key to making sure the user sees the success message!
        setTimeout(() => {
          navigate("/my-appointments");
        }, 1000);
      } else {
        toast.error(data.message);
      }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // ... keep useEffects and return UI same

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- Doctor Details --- */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              className="bg-primary w-full sm:w-72 rounded-2xl shadow-lg object-cover"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className="flex-1 border border-gray-100 rounded-2xl p-6 sm:p-8 bg-white shadow-sm relative -mt-12 sm:mt-0 mx-4 sm:mx-0">
            <div className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
              <h1>{docInfo.name}</h1>
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </div>

            <div className="flex items-center gap-2 text-sm mt-2 text-gray-600">
              <p className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {docInfo.degree}
              </p>
              <p className="text-gray-500">{docInfo.speciality}</p>
              <span className="py-0.5 px-2 border border-gray-200 text-xs rounded-full font-medium">
                {docInfo.experience}
              </span>
            </div>

            <div className="mt-6">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                About <img className="w-3.5" src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                {docInfo.about}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50">
              <p className="text-gray-500">
                Appointment fee:{" "}
                <span className="text-gray-900 font-bold text-lg ml-1">
                  ${docInfo.fees}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* --- Booking Slots UI --- */}
        <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700">
          <p className="text-lg text-gray-800">Booking slots</p>

          {/* Date Selector */}
          <div className="flex gap-4 items-center w-full overflow-x-auto mt-5 pb-2 no-scrollbar">
            {docSlot.length > 0 &&
              docSlot.map((item, index) => (
                <div
                  key={index}
                  onClick={() => { setSlotIndex(index); setSlotTime(""); }}
                  className={`flex flex-col items-center justify-center py-6 min-w-[4.5rem] rounded-2xl h-[100px] cursor-pointer transition-all duration-300 shadow-sm ${slotIndex === index ? "bg-blue-600 text-white shadow-blue-200 shadow-lg" : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider">
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {item[0] && item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
          </div>

          {/* Time Selector */}
          <div className="flex items-center gap-3 w-full overflow-x-auto mt-6 pb-2 no-scrollbar">
            {docSlot.length > 0 &&
              docSlot[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-medium flex-shrink-0 px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 border ${item.time === slotTime ? "bg-blue-600 text-white border-blue-600 shadow-md" : "text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          {/* Action Button */}
          <button 
            onClick={bookAppointment}
            className="bg-green-600 text-white text-sm font-semibold px-12 py-4 rounded-full mt-8 shadow-lg hover:bg-green-700 hover:scale-105 active:scale-95 transition-all"
          >
            Book an appointment
          </button>
        </div>

        {/* Related Doctors Section */}
        <div className="pt-16 border-t border-gray-100 mt-12">
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appointment;