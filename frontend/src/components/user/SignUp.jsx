import React, { useState } from "react";
import { useToast } from '../../context/ToastContext';
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function SignUp() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      addToast("Password must be at least 8 characters long", 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast("Passwords do not match", 'error');
      return;
    }

    try {
      const res = await api.post('/auth/user/register', {
        name: userName,
        email,
        password,
        role: 'user' // Hardcoded role for regular users
      });
      // Use sessionStorage for tab-specific isolation
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('role', res.data.user.role);
      sessionStorage.setItem('userName', res.data.user.name);
      sessionStorage.setItem('userId', res.data.user.id);

      // Also store in localStorage as backup
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); // Store role
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userId', res.data.user.id);

      addToast("Account created successfully! Welcome to Banquet Partner.", 'success');

      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/home'); // Regular users go to home
      }

    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.msg || "Registration failed. Please try again.", 'error');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-overlay">
          <div className="signup-left-content">
            <h1 className="signup-brand-title">Banquet Booking System</h1>
            <p className="signup-brand-tagline">Manage your events with elegance and ease</p>
          </div>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-header">


          <h2 className="signup-welcome">Get Started</h2>
          <p className="signup-subtitle">Create your account to begin booking</p>
        </div>
        <div className="signup-card">
          <h3 className="signup-form-title">Create Account</h3>
          <p className="signup-form-subtitle">Sign up to start managing your banquet bookings</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userName">User Name</label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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

            <div className="checkbox-group" style={{ marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            <button type="submit" className="signup-button">
              Create Account
            </button>
            <div className="signup-footer">
              <p>Already have an account?{" "}
                <a href="#" className="signin-link" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
