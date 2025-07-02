import React, { useEffect, useState } from 'react';
import { FaUser, FaLock, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { iconClass, inputBase } from '../../assets/dummydata';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import axios from 'axios'
const url = `https://the-food-app-backend.onrender.com`; 
const Login = ({ onLoginSuccess, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState({visible: false,message:'',isError:false});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remmemberMe: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) {
      setFormData(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    setShowToast({
      visible: true,
      message: "Both email and password are required",
      isError: true
    });
    setTimeout(() => {
      setShowToast({ visible: false, message: '', isError: false });
    }, 2000);
    return;
  }

  try {
    const res = await axios.post(`${url}/api/user/login`, {
      email: formData.email,
      password: formData.password
    });

    if (res.status === 200 && res.data.token) {
      localStorage.setItem('authToken', res.data.token);

      if (formData.rememberMe) {
        localStorage.setItem('loginData', JSON.stringify(formData));
      } else {
        localStorage.removeItem('loginData');
      }

      setShowToast({
        visible: true,
        message: "Login successful",
        isError: false
      });

      setTimeout(() => {
        setShowToast({ visible: false, message: '', isError: false });
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(res.data.token);
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      }, 1500);
    }
  } catch (error) {
    setShowToast({
      visible: true,
      message: error.response?.data?.message || "Login failed",
      isError: true
    });
    setTimeout(() => {
      setShowToast({ visible: false, message: '', isError: false });
    }, 2000);
  }
};
  

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Message */}
     {showToast.visible && (
  <div className={`fixed top-4 right-4 z-50 transition-all duration-300 translate-y-0 opacity-100`}>
    <div className={`${showToast.isError ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm`}>
      <FaCheckCircle className="flex-shrink-0" />
      <span>{showToast.message || (showToast.isError ? 'Login failed' : 'Login Successful!')}</span>
    </div>
  </div>
)}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div className="relative">
          <FaUser className={iconClass} />
          <input
            type="email"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className={iconClass} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="remmemberMe"
            checked={formData.remmemberMe}
            onChange={handleChange}
            className="accent-amber-500"
          />
          <label htmlFor="remmemberMe" className="text-sm text-white">
            Remember Me
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3 rounded-md transition duration-300"
        >
          Login
        </button>
        
      </form>
      <div>
        <Link to='/signup ' onClick={ onClose} className='inline-flex items-center gap-2
        text-amber-400 hover:text-amber-600 transition-colors'>
          <FaUserPlus></FaUserPlus>
          Create New Account
        </Link>
      </div>


    </div>
  );
};

export default Login;
