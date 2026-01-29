import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
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

  // --- ADDED: Date Formatting Helper ---
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_'); // Splits "22_08_2024"
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Returns format: 22 Aug 2024
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
      console.log(error);
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
      } else {
        toast.error(data.message);
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
        toast.error(data.message);
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (success === "true" && appointmentId && token) {
      verifyStripe();
    }
  }, [success, appointmentId, token]);

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="relative">
      {showSuccessUI && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="mt-6 text-2xl font-bold text-gray-800">
            Payment Successful!
          </p>
          <p className="text-gray-500">Your appointment is confirmed.</p>
        </div>
      )}

      <div>
        <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
          My Appointments
        </p>
        <div className="flex flex-col gap-4 mt-4">
          {appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b last:border-none"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50 rounded"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {/* UPDATED: Using format function and adding comma */}
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-blue-500 rounded text-blue-500 bg-blue-50 cursor-default">
                    Completed
                  </button>
                )}

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <>
                    <button
                      disabled={paymentLoading === item._id}
                      onClick={() => payStripe(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300"
                    >
                      {paymentLoading === item._id
                        ? "Redirecting..."
                        : "Pay Online"}
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 font-medium bg-green-50 cursor-default">
                    Paid & Confirmed
                  </button>
                )}

                {item.cancelled && (
                  <div className="flex flex-col gap-2">
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-default">
                      Appointment Cancelled
                    </button>
                    <button
                      onClick={() => deleteAppointment(item._id)}
                      className="text-xs text-gray-400 text-center hover:text-red-600 transition-all"
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