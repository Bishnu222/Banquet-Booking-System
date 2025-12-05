import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './SignUp.css'

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up:', formData)
  }

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
        <div className="signup-form-container">
          <div className="signup-header">
            <h2 className="signup-welcome">Get Started</h2>
            <p className="signup-subtitle">Create your account to begin booking</p>
          </div>
          <div className="signup-card">
            <h3 className="signup-form-title">Create Account</h3>
            <p className="signup-form-subtitle">Sign up to start managing your banquet bookings</p>
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeToTerms">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <button type="submit" className="signup-button">Create Account</button>
            </form>
            <div className="signup-footer">
              <p>Already have an account? <Link to="/signin" className="signin-link">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp

