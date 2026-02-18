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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">

        {/* LEFT PROFILE SIDEBAR */}
        <div className="bg-white/70 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl p-10 flex flex-col items-center text-center relative overflow-hidden">

          {/* Soft Glow Background */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />

          {/* Avatar */}
          <div className="relative group z-10">
            <img
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
              className="w-36 h-36 rounded-3xl object-cover shadow-2xl ring-4 ring-white transition duration-500 group-hover:scale-105"
            />
            {isEdit && (
              <label className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition cursor-pointer">
                Change Photo
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            )}
          </div>

          {/* Name */}
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            {userData.name}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Patient ID • PR-{userData._id.slice(-5).toUpperCase()}
          </p>

          {/* Profile Completion */}
          <div className="mt-8 w-full">
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Profile Completion
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 w-4/5 rounded-full transition-all duration-500"></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">80% Completed</p>
          </div>

          {/* Status Badge */}
          <div className="mt-8 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold tracking-wide">
            Active Account
          </div>
        </div>

        {/* RIGHT SETTINGS PANEL */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUserProfileData();
            }}
            className="divide-y divide-slate-100"
          >

            {/* HEADER */}
            <div className="p-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Account Settings
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Manage your personal information and contact details
              </p>
            </div>

            {/* PERSONAL SECTION */}
            <div className="p-10 space-y-10">

              <div>
                

                <div className="grid md:grid-cols-2 gap-8">

                  {[
                    {
                      label: "Full Name",
                      type: "text",
                      value: userData.name,
                      editable: true,
                      onChange: (e) =>
                        setUserData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        })),
                    },
                    {
                      label: "Email Address",
                      type: "email",
                      value: userData.email,
                      editable: false,
                    },
                    {
                      label: "Phone Number",
                      type: "text",
                      value: userData.phone,
                      editable: true,
                      onChange: (e) =>
                        setUserData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        })),
                    },
                    {
                      label: "Date of Birth",
                      type: "date",
                      value: userData.dob,
                      editable: true,
                      onChange: (e) =>
                        setUserData((prev) => ({
                          ...prev,
                          dob: e.target.value,
                        })),
                    },
                  ].map((field, index) => (
                    <div key={index} className="flex flex-col">
                      <label className="text-sm font-semibold text-slate-700 mb-3">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        disabled={!isEdit || !field.editable}
                        value={field.value}
                        onChange={field.onChange}
                        className={`rounded-2xl px-4 py-3 border text-sm font-medium transition-all duration-200 ${
                          isEdit && field.editable
                            ? "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white shadow-sm"
                            : "bg-slate-100 border-slate-200 text-slate-500"
                        }`}
                      />
                    </div>
                  ))}

                  {/* GENDER */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-3">
                      Gender
                    </label>
                    <select
                      disabled={!isEdit}
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className={`rounded-2xl px-4 py-3 border text-sm font-medium transition-all ${
                        isEdit
                          ? "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white shadow-sm"
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* ADDRESS SECTION */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3">
                      Address
                    </label>

                <div className="grid md:grid-cols-2 gap-8">
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    disabled={!isEdit}
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line1: e.target.value,
                        },
                      }))
                    }
                    className={`rounded-2xl px-4 py-3 border text-sm font-medium transition ${
                      isEdit
                        ? "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white shadow-sm"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}
                  />

                  <input
                    type="text"
                    placeholder="Address Line 2"
                    disabled={!isEdit}
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line2: e.target.value,
                        },
                      }))
                    }
                    className={`rounded-2xl px-4 py-3 border text-sm font-medium transition ${
                      isEdit
                        ? "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 bg-white shadow-sm"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}
                  />
                </div>
              </div>

            </div>

            {/* ACTION BAR */}
            <div className="bg-white/80 backdrop-blur-xl p-8 flex justify-end gap-4 border-t border-slate-200">
              {isEdit && (
                <button
                  type="button"
                  onClick={() => setIsEdit(false)}
                  className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  isEdit ? updateUserProfileData() : setIsEdit(true)
                }
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {isEdit ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
);



};

export default MyProfile;