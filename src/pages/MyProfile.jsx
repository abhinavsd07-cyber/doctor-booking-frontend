import React, { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendURL, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendURL + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-5xl mx-auto my-12 px-6 font-sans">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* --- LEFT: IDENTITY CARD --- */}
          <div className="w-full lg:w-1/3 flex flex-col items-center lg:sticky lg:top-24">
            <div className="relative group">
              <div className="w-44 h-44 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
                <img
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isEdit ? "scale-110 opacity-40 blur-sm" : "scale-100"
                  }`}
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="profile"
                />
              </div>
              
              {isEdit && (
                <label htmlFor="image" className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
                  <div className="bg-white/90 p-3 rounded-2xl shadow-xl backdrop-blur-sm">
                    <img src={assets.upload_icon} className="w-6" alt="upload" />
                  </div>
                  <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                </label>
              )}
            </div>

            <div className="mt-6 mb-4 text-center w-full">
              {isEdit ? (
                <input
                  className="bg-slate-50 border-b-2 border-blue-600 text-2xl font-bold text-slate-900 outline-none px-4 py-1 text-center w-full rounded-t-lg"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {userData.name}
                </h1>
              )}
              <div className="mt-2 inline-block bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                  Patient ID: PR-{userData._id.slice(-5).toUpperCase()}
                </p>
              </div>
            </div>

            <button
              onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
              className="mt-8 w-full py-3 rounded-full bg-slate-900 text-white font-bold text-xs tracking-widest uppercase hover:bg-blue-600 transition-all duration-300 shadow-lg active:scale-95"
            >
              {isEdit ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {/* --- RIGHT: BENTO DATA GRID --- */}
          <div className="flex-1 w-full space-y-10">
            
            {/* Contact Group */}
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-10 h-[2px] bg-blue-600"></span> Contact Details
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</p>
                  <p className="text-slate-900 font-semibold text-base md:text-lg break-all">{userData.email}</p>
                </div>
                
                <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</p>
                  {isEdit ? (
                    <input className="w-full bg-slate-50 border-b border-blue-400 p-1 outline-none font-semibold text-lg" value={userData.phone} onChange={(e) => setUserData(prev => ({...prev, phone: e.target.value}))}/>
                  ) : (
                    <p className="text-slate-900 font-semibold text-lg">{userData.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Home Address</p>
                  {isEdit ? (
                    <div className="space-y-2">
                      <input className="w-full bg-slate-50 border-b border-blue-400 p-1 outline-none font-semibold" value={userData.address.line1} onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))}/>
                      <input className="w-full bg-slate-50 border-b border-blue-400 p-1 outline-none font-semibold" value={userData.address.line2} onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))}/>
                    </div>
                  ) : (
                    <p className="text-slate-900 font-semibold text-base md:text-lg">{userData.address.line1}, {userData.address.line2}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Health Record Group */}
            <div className="space-y-6 pt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-10 h-[2px] bg-blue-600"></span> Bio Profile
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-xl">
                  <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-3">Gender</p>
                  {isEdit ? (
                    <select className="bg-slate-800 text-white p-2 rounded-xl outline-none w-full font-semibold" value={userData.gender} onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <p className="text-2xl font-bold tracking-tight">{userData.gender}</p>
                  )}
                </div>

                <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl">
                  <p className="text-[9px] font-bold text-blue-100 uppercase tracking-widest mb-3">Birthday</p>
                  {isEdit ? (
                    <input type="date" className="bg-blue-500 text-white p-2 rounded-xl outline-none w-full font-semibold" value={userData.dob} onChange={(e) => setUserData(prev => ({...prev, dob: e.target.value}))}/>
                  ) : (
                    <p className="text-2xl font-bold tracking-tight">{userData.dob}</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;