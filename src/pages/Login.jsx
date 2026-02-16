import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { backendURL, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpoint = state === "Sign Up" ? "/api/user/register" : "/api/user/login";
      const payload = state === "Sign Up" ? { name, password, email } : { password, email };

      const { data } = await axios.post(backendURL + endpoint, payload);
      if (data.success) {
        toast.success(state === "Sign Up" ? "Account created successfully!" : "Welcome back!");
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      const { data } = await axios.post(`${backendURL}/api/user/google-auth`, {
        idToken: res.credential,
      });
      if (data.success) {
        toast.success("Welcome back! Login successful.");
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Google Login Failed");
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center font-sans">
      <div className="flex flex-col gap-6 m-auto items-center p-10 min-w-[340px] sm:min-w-[420px] bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-slate-600">
        
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-slate-900 tracking-tight">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </p>
          <p className="text-sm font-medium text-slate-400">
            Please {state === "Sign Up" ? "sign up" : "log in"} to manage your health.
          </p>
        </div>

        <div className="w-full space-y-4">
          {state === "Sign Up" && (
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-widest mb-1.5 ml-1 text-slate-400">Full Name</p>
              <input
                className="bg-slate-50 border border-slate-100 rounded-2xl w-full p-3.5 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-300"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="w-full">
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5 ml-1 text-slate-400">Email Address</p>
            <input
              className="bg-slate-50 border border-slate-100 rounded-2xl w-full p-3.5 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-300"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="example@mail.com"
              required
            />
          </div>

          <div className="w-full">
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5 ml-1 text-slate-400">Password</p>
            <input
              className="bg-slate-50 border border-slate-100 rounded-2xl w-full p-3.5 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-300"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-slate-900 text-white w-full py-4 text-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all duration-300 active:scale-95 mt-2"
          style={{ borderRadius: "50px" }}
        >
          {state === "Sign Up" ? "Register Now" : "Login Account"}
        </button>

        {/* --- OR DIVIDER --- */}
        <div className="w-full flex items-center gap-4 py-2">
          <hr className="flex-1 border-slate-100" />
          <span className="text-[10px] font-bold text-slate-300 tracking-[0.3em]">OR</span>
          <hr className="flex-1 border-slate-100" />
        </div>

        {/* --- GOOGLE BUTTON --- */}
        <div className="w-full flex justify-center scale-110">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login Failed")}
            theme="outline"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="pt-4 text-center">
          {state === "Sign Up" ? (
            <p className="text-sm font-medium">
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm font-medium">
              New to our clinic?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Create account
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;