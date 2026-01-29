import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext"; // Import Context

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Use global state instead of local useState
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
        onClick={() => navigate("/")}
      />

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-5 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-white bg-blue-900 px-4 py-2 rounded-full" : ""
          }
          style={{ textDecoration: "none" }}
        >
          <li className="py-1 uppercase">Home</li>
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) => (isActive ? "text-white bg-blue-900 px-4 py-2 rounded-full" : "") }style={{ textDecoration: "none" }}
        >
          <li className="py-1 uppercase">All Doctors</li>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "text-white bg-blue-900 px-4 py-2 rounded-full" : "")} style={{ textDecoration: "none" }}
        >
          <li className="py-1 uppercase">About</li>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "text-white bg-blue-900 px-4 py-2 rounded-full" : "")} style={{ textDecoration: "none" }}
        >
          <li className="py-1 uppercase">Contact</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {/* Check for token and userData */}
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            {/* Display actual user image from database or fallback */}
            <img
              src={userData.image || assets.profile_pic}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5" />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md">
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => navigate("/my-profile")}
                >
                  My Profile
                </p>
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => navigate("/my-appointments")}
                >
                  My Appointments
                </p>
                <p className="hover:text-black cursor-pointer" onClick={logout}>
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="text-white bg-blue-600  px-4 py-3  font-light hidden md:block"
            onClick={() => navigate("/login")}
           style={{borderRadius:"50px"}}>
            Create account
          </button>
        )}

        {/* Mobile Menu Trigger */}
        <img
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          onClick={() => setShowMenu(true)}
          alt="menu icon"
        />

        {/* --- Mobile Menu Overlay --- */}
        <div
          className={`${showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} alt="logo" className="w-36" />
            <img
              src={assets.cross_icon}
              alt="close icon"
              onClick={() => setShowMenu(false)}
              className="w-7 cursor-pointer"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
