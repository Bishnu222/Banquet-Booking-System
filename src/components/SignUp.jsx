import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log("Sign up attempt:", { fullName, email, phone, password, confirmPassword, agreeToTerms });
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-overlay">
          <div className="signup-left-content">
            <h1 className="signup-brand-title">Banquet Booking</h1>
            <p className="signup-brand-tagline">Your Perfect Event Starts Here</p>
          </div>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-form-container">
          <div className="signup-header">
            <h2 className="signup-welcome">Create Account</h2>
            <p className="signup-subtitle">Sign up to start managing your banquet bookings</p>
          </div>
          <div className="signup-card">
            <h3 className="signup-form-title">Sign Up</h3>
            <p className="signup-form-subtitle">Fill in your details to create an account</p>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <a href="#" className="signin-link">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="signin-link">Privacy Policy</a>
                </label>
              </div>
              <button type="submit" className="signup-button">
                Create Account
              </button>
            </form>
            <div className="signup-footer">
              Already have an account?{" "}
              <a href="#" className="signin-link" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
