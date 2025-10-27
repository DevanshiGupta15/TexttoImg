import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [state, setState] = useState("Login");
  const { showLogin, setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSumbitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={onSumbitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.profile_icon} alt="" className="w-5 h-5" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Full Name"
              className="outline-none text-sm"
              required
            />
          </div>
        )}
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Id"
            className="outline-none text-sm"
            required
          />
        </div>
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="password"
            className="outline-none text-sm"
            required
          />
        </div>
        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password?
        </p>
        <button className="bg-blue-600 w-full text-white py-2 rounded-full">
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {/* --- GOOGLE SIGN-IN BUTTON START --- */}
        <div className="mt-4 flex flex-col gap-2">
            <div className="relative flex justify-center py-4">
                <div className="bg-white px-2 text-sm text-gray-500">
                    OR
                </div>
            </div>
            
            <a 
                href={`${backendUrl}/api/auth/google`} 
                className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 py-2.5 text-gray-700 bg-white hover:bg-gray-50 transition duration-150 shadow-sm"
            >
                {/* Simple Google Icon SVG Path for visual clarity */}
                <svg viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8.917h11.758c-1.353,6.241-7.14,10.871-11.758,10.871c-5.83,0-10.566-4.736-10.566-10.566s4.736-10.566,10.566-10.566c3.21,0,5.922,1.45,7.912,3.31l7.46-7.159c-3.864-3.57-8.895-5.748-15.372-5.748C11.444,4.583,4.583,11.444,4.583,20c0,8.556,6.861,15.417,15.417,15.417c8.441,0,14.64-5.917,15.118-14.75h-11.758V20.083z"/>
                    <path fill="#4CAF50" d="M19.999,35.417c-3.882,0-7.279-1.928-9.375-4.858l-7.46,7.159c2.729,2.695,6.342,4.354,10.74,4.354c4.686,0,8.749-1.879,11.758-4.871l-7.46-7.159C24.499,33.588,22.251,35.417,19.999,35.417z"/>
                    <path fill="#1976D2" d="M19.999,10.25c3.21,0,5.922,1.45,7.912,3.31l7.46-7.159c-3.864-3.57-8.895-5.748-15.372-5.748C11.444,4.583,4.583,11.444,4.583,20c0,2.152,0.48,4.187,1.334,6.012l7.46-7.159C13.251,12.23,16.036,10.25,19.999,10.25z"/>
                    <path fill="#EA4335" d="M43.611,20.083H24v8.917h11.758c-0.478,8.833-6.677,14.75-15.118,14.75c-4.494,0-8.24-1.659-10.74-4.354l-7.46,7.159c3.009,2.992,7.072,4.871,11.758,4.871c8.441,0,15.291-6.86,15.291-15.417C35.416,11.444,28.555,4.583,19.999,4.583c-4.686,0-8.749,1.879-11.758,4.871l7.46,7.159C15.584,12.23,17.751,10.25,19.999,10.25h15.417V20.083z" transform="translate(0 0)"/>
                </svg>
                <span className="font-medium text-sm">
                    Continue with Google
                </span>
            </a>
        </div>
        {/* --- GOOGLE SIGN-IN BUTTON END --- */}

        {state == "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign Up!
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}
        <img
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setShowLogin(false)}
        />
      </motion.form>
    </div>
  );
};

export default Login;