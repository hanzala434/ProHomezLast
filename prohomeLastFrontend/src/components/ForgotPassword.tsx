import React, { useState } from "react";
import axios from "axios";
import styles from "../style/ForgetPassword.module.css"
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Email Submission
  const handleEmailSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/forgot-password`,
        { email }
      );
      alert(response.data.message);
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  // Handle OTP Verification
  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/verify-otp`,
        { email, otp }
      );
      alert(response.data.message);
      setStep("reset");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP!");
    }
    setLoading(false);
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PROHOMEZ_BACKEND_URL}/reset-password`,
        { email, newPassword }
      );
      alert(response.data.message);
      navigate("/login"); // Redirect to login
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password!");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      {error && <p className="text-danger">{error}</p>}
      
      {step === "email" && (
        <div>
          <label className={styles.email}>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={`btn btn-primary mt-2 ${styles.sendOtpButton}`} onClick={handleEmailSubmit} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div>
          <label className={styles.email}>Enter OTP:</label>
          <input
            type="text"
            className="form-control"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className={`btn btn-primary mt-2 ${styles.sendOtpButton}`} onClick={handleOtpSubmit} disabled={loading}>
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}

      {step === "reset" && (
        <div>
          <label className={styles.email}>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className={`btn btn-success ${styles.sendOtpButton}`} mt-2 onClick={handlePasswordReset} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
