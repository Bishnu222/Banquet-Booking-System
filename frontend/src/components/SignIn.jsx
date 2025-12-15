import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

function SignIn() {
  const navigate = useNavigate();
  // Removed activeTab state as this is now purely User login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      // Basic check: if trying to login as owner but role is 'user', warn them (optional, but good UX)
      // For now, we just redirect based on actual role
      if (res.data.user.role === 'admin') navigate('/admin-dashboard');
      else if (res.data.user.role === 'owner') navigate('/owner-dashboard');
      else navigate('/home'); // Redirect to User Dashboard

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.msg || err.message || "Login failed";
      alert(errorMessage);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="signin-overlay">
          <div className="signin-left-content">
            <h1 className="signin-brand-title">
              Banquet Booking System
            </h1>
            <p className="signin-brand-tagline">
              Manage your events with elegance and ease
            </p>
          </div>
        </div>
      </div>
      <div className="signin-right">
        <div className="signin-header">
          {/* Auth Switch Buttons */}
          <div className="auth-switch-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '5px', background: '#f5f5f5', borderRadius: '8px', width: 'fit-content' }}>
            <button
              className="auth-switch-btn active"
              style={{ background: '#000', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'default', fontWeight: '600' }}
              disabled
            >
              User Login
            </button>
            <button
              className="auth-switch-btn"
              style={{ background: 'transparent', color: '#666', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
              onClick={() => navigate('/owner-login')}
            >
              Owner Login
            </button>
          </div>

          <h2 className="signin-welcome">
            Welcome Back
          </h2>
          <p className="signin-subtitle">
            Sign in to book your next event
          </p>
        </div>
        <div className="signin-card">
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
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            <button type="submit" className="signin-button">
              Sign In
            </button>
            <div className="signin-footer">
              <p>Don't have an account?{" "}
                <a href="#" className="signup-link" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
