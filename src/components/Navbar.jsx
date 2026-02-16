import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 font-sans ${isScrolled ? 'py-3 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'py-6 bg-white'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
        
        {/* LOGO */}
        <div className="flex items-center">
            <img 
                onClick={() => { navigate("/"); window.scrollTo(0,0); }} 
                className="w-32 md:w-36 cursor-pointer hover:opacity-80 transition-opacity" 
                src={assets.logo} 
                alt="logo" 
            />
        </div>

        {/* DESKTOP MENU */}
       {/* DESKTOP MENU */}
<ul className="hidden md:flex items-center gap-4">
  {['Home', 'Doctors', 'About', 'Contact'].map((item) => (
    <NavLink 
        key={item} 
        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
        className={({ isActive }) => 
          `px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
            isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
          }`
        }
        style={{ textDecoration: "none" }}
    >
      {item}
    </NavLink>
  ))}
</ul>

        {/* USER ACTIONS */}
        <div className="flex items-center gap-5">
          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img 
                src={userData.image || assets.profile_pic} 
                className="w-9 h-9 object-cover ring-2 ring-slate-100 group-hover:ring-blue-500 transition-all" 
                style={{ borderRadius: "50px" }}
              />
              <img src={assets.dropdown_icon} className="w-2.5 transition-transform group-hover:rotate-180" alt="" />
              
              {/* Profile Dropdown */}
              <div className="absolute top-full right-0 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                <div className="min-w-[200px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-600">
                  <p onClick={() => navigate("/my-profile")} className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-bold transition-colors tracking-wide">My Profile</p>
                  <p onClick={() => navigate("/my-appointments")} className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-bold transition-colors tracking-wide">Appointments</p>
                  <div className="my-1 border-t border-slate-50"></div>
                  <p onClick={logout} className="px-4 py-3 hover:bg-rose-50 text-rose-500 rounded-xl text-xs font-bold transition-colors tracking-wide">Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button 
                onClick={() => navigate("/login")} 
                className="bg-slate-900 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hidden md:block hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                style={{ borderRadius: "50px" }}
            >
                Login / Signup
            </button>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button onClick={() => setShowMenu(true)} className="md:hidden p-2.5 bg-slate-50 rounded-full">
             <img className="w-5" src={assets.menu_icon} alt="menu" />
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <div className={`fixed inset-0 z-[2000] bg-white transition-all duration-500 ease-in-out transform ${showMenu ? "translate-x-0" : "translate-x-full"} md:hidden`}>
            <div className="flex items-center justify-between px-8 py-8 border-b border-slate-50">
                <img src={assets.logo} className="w-32" alt="" />
                <button onClick={() => setShowMenu(false)} className="p-3 bg-slate-50 rounded-full">
                    <img src={assets.cross_icon} className="w-5" alt="close" />
                </button>
            </div>
            
            <ul className="flex flex-col gap-2 p-8 text-xl font-bold text-slate-900 uppercase tracking-widest">
                {['Home', 'Doctors', 'About', 'Contact'].map((item) => (
                    <NavLink 
                        key={item} 
                        onClick={() => setShowMenu(false)} 
                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                        className="py-4 border-b border-slate-50 last:border-0 hover:text-blue-600 transition-colors"
                    >
                        {item}
                    </NavLink>
                ))}
            </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;