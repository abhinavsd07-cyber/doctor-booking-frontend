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
      <div className="min-h-screen flex justify-center items-start pt-10 bg-gray-50">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer relative">
                <img
                  className="w-32 h-32 rounded-full object-cover opacity-80"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="profile"
                />
                <img
                  src={assets.upload_icon}
                  className="w-8 absolute bottom-2 right-2"
                  alt="upload"
                />
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <img
                className="w-32 h-32 rounded-full object-cover"
                src={userData.image}
                alt="profile"
              />
            )}

            {/* Name */}
            {isEdit ? (
              <input
                className="mt-4 text-2xl font-semibold text-center border rounded-md p-2 outline-none w-full max-w-xs"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <h3 className="mt-4 text-2xl font-semibold text-gray-800">
                {userData.name}
              </h3>
            )}
          </div>

          <hr className="my-6" />

          {/* Contact Info */}
          <section>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Contact Information
            </p>

            <div className="grid grid-cols-3 gap-y-3 text-sm">
              <p className="font-medium">Email</p>
              <p className="col-span-2 text-blue-500">{userData.email}</p>

              <p className="font-medium">Phone</p>
              <div className="col-span-2">
                {isEdit ? (
                  <input
                    className="w-full border rounded-md p-2 outline-none"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        phone: String(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <p className="text-gray-600">{userData.phone}</p>
                )}
              </div>

              <p className="font-medium">Address</p>
              <div className="col-span-2 space-y-2">
                {isEdit ? (
                  <>
                    <input
                      className="w-full border rounded-md p-2 outline-none"
                      value={userData.address.line1}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                    />
                    <input
                      className="w-full border rounded-md p-2 outline-none"
                      value={userData.address.line2}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                    />
                  </>
                ) : (
                  <p className="text-gray-600">
                    {userData.address.line1}
                    <br />
                    {userData.address.line2}
                  </p>
                )}
              </div>
            </div>
          </section>

          <hr className="my-6" />

          {/* Basic Info */}
          <section>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Basic Information
            </p>

            <div className="grid grid-cols-3 gap-y-3 text-sm">
              <p className="font-medium">Gender</p>
              <div className="col-span-2">
                {isEdit ? (
                  <select
                    className="border rounded-md p-2 outline-none"
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option>Not Selected</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                ) : (
                  <p className="text-gray-600">{userData.gender}</p>
                )}
              </div>

              <p className="font-medium">Birthday</p>
              <div className="col-span-2">
                {isEdit ? (
                  <input
                    type="date"
                    className="border rounded-md p-2 outline-none"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-gray-600">{userData.dob}</p>
                )}
              </div>
            </div>
          </section>

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            {isEdit ? (
              <button
                onClick={updateUserProfileData}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
