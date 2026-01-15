import React, { useState } from "react";
import { useToast } from '../../context/ToastContext';
import "./Auth.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../../api";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  // Removed activeTab state as this is now purely User login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This SignIn.jsx is for USERS.

      const res = await api.post('/auth/user/login', {
        email,
        password
      });

      console.log('✅ User Login Success:', res.data.user);
      // Use sessionStorage for tab-specific isolation
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('role', res.data.user.role);
      sessionStorage.setItem('userName', res.data.user.name);
      sessionStorage.setItem('userId', res.data.user.id);

      // Also store in localStorage as backup
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userId', res.data.user.id);

      addToast("Logged in successfully! Welcome back.", 'success');

      // Handle admin vs regular user navigation
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        const from = location.state?.from || '/home';
        navigate(from, { replace: true });
      }

    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.msg || "Login failed. Please check your credentials.", 'error');
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
          {/* Login Role Toggle */}
          <div className="login-toggle-container">
            <button className="login-toggle-btn active">User Login</button>
            <button className="login-toggle-btn" onClick={() => navigate('/owner-login')}>Owner Login</button>
          </div>

          <h2 className="signin-welcome">
            {new URLSearchParams(location.search).get('expired') ? 'Session Expired' : 'Welcome Back'}
          </h2>
          <p className="signin-subtitle">
            {new URLSearchParams(location.search).get('expired')
              ? 'Please sign in again to continue.'
              : 'Sign in to book your next event'}
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
              <Link to="/forgot-password?type=user" className="forgot-password">Forgot Password?</Link>
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
