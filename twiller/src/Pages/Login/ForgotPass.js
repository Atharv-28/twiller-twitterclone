import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import twitterimg from "../../image/twitter.jpeg";
import app from "../../context/firbase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./login.css";

const ForgotPass = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://twiller-twitterclone-dz1k.onrender.com/api/forgot-password",
        { emailOrPhone }
      );
      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://twiller-twitterclone-dz1k.onrender.com/api/verify-otp",
        { emailOrPhone, otp }
      );
      if (response.data.success) {
        await sendPasswordResetEmail(auth, emailOrPhone);
        setMessage(
          "OTP verified. Please check your email for the password reset link."
        );
        navigate("/login");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img className="image" src={twitterimg} alt="twitterimage" />
      </div>
      <div className="form-container">
        <h2 className="heading">Forgot Password</h2>
        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="email"
              placeholder="Enter your email or phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
            <button type="submit" className="btn">Submit</button>
            <button type="button" className="btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              className="email"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="btn" type="submit">Verify OTP</button>
            <button type="button" className="btn" onClick={() => navigate("/login")}>
            Back to Login
          </button>
          </form>
        )}
        {message && <p className="msg">{message}!!</p>}
      </div>
    </div>
  );
};

export default ForgotPass;