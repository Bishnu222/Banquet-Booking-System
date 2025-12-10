import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignIn.css';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password, rememberMe });
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="signin-overlay">
          <div className="signin-left-content">
            <h1 className="signin-brand-title">Banquet Booking</h1>
            <p className="signin-brand-tagline">Your Perfect Event Starts Here</p>
          </div>
        </div>
      </div>
      <div className="signin-right">
        <div className="signin-form-container">
          <div className="signin-header">
            <h2 className="signin-welcome">Welcome Back</h2>
            <p className="signin-subtitle">Sign in to continue to your account</p>
          </div>
          <div className="signin-card">
            <h3 className="signin-form-title">Sign In</h3>
            <p className="signin-form-subtitle">Enter your credentials to access your account</p>
            <form className="signin-form" onSubmit={handleSubmit}>
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
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-options">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              <button type="submit" className="signin-button">
                Sign In
              </button>
            </form>
            <div className="signin-footer">
              Don't have an account?{" "}
              <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
