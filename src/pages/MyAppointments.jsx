import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const MyAppointments = () => {
  const { backendURL, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const appointmentId = searchParams.get("appointmentId");

  const [showSuccessUI, setShowSuccessUI] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(null);

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const payStripe = async (appointmentId) => {
    try {
      setPaymentLoading(appointmentId);
      const { data } = await axios.post(
        backendURL + "/api/user/payment-stripe",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        setPaymentLoading(null);
      }
    } catch (error) {
      toast.error(error.message);
      setPaymentLoading(null);
    }
  };

  const verifyStripe = async () => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/verify-stripe",
        { success, appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        setShowSuccessUI(true);
        getUserAppointments();
        setTimeout(() => setShowSuccessUI(false), 3000);
      }
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/delete-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (success === "true" && appointmentId && token) verifyStripe();
  }, [success, appointmentId, token]);

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-10 font-sans">
      {/* Success Overlay */}
      {showSuccessUI && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-xl font-bold text-slate-900 tracking-tight">Payment Successful</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Appointments</h1>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200">
            {appointments.length} Scheduled
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {appointments.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 flex flex-col lg:flex-row gap-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Doctor Image */}
              <div className="shrink-0">
                <img 
                  className="w-full lg:w-32 h-40 lg:h-32 rounded-2xl object-cover bg-slate-50 border border-slate-100" 
                  src={item.docData.image} 
                  alt={item.docData.name} 
                />
              </div>

              {/* Info Middle */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">{item.docData.name}</h2>
                  <p className="text-blue-600 text-xs font-semibold mt-0.5">{item.docData.speciality}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      {item.docData.address.line1}, {item.docData.address.line2}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                    <p className="text-sm text-slate-800 font-semibold mt-1">
                      {slotDateFormat(item.slotDate)} <span className="text-slate-300 mx-1">|</span> {item.slotTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex flex-col gap-2.5 justify-center lg:w-52 shrink-0">
                {item.isCompleted && (
                  <div className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs text-center">
                    Completed
                  </div>
                )}

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <>
                    <button
                      onClick={() => payStripe(item._id)}
                      disabled={paymentLoading === item._id}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-blue-600 transition-all active:scale-95"
                    >
                      {paymentLoading === item._id ? "Processing..." : "Pay Online"}
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {!item.cancelled && item.payment && !item.isCompleted && (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-xs text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Confirmed
                  </div>
                )}

                {item.cancelled && (
                  <div className="flex flex-col gap-2">
                    <div className="w-full py-2.5 rounded-xl bg-red-50 text-red-500 border border-red-100 font-bold text-xs text-center">
                      Cancelled
                    </div>
                    <button
                      onClick={() => deleteAppointment(item._id)}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-600 transition-all text-center uppercase tracking-tighter"
                    >
                      Remove from history
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;