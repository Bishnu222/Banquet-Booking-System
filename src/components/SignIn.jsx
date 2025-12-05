import React, { useState } from 'react'
import './SignIn.css'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign in:', { email, password, rememberMe })
  }

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="signin-overlay">
          <div className="signin-left-content">
            <h1 className="signin-brand-title">Banquet Booking System</h1>
            <p className="signin-brand-tagline">Manage your events with elegance and ease</p>
          </div>
        </div>
      </div>
      <div className="signin-right">
        <div className="signin-form-container">
          <div className="signin-header">
            <h2 className="signin-welcome">Welcome Back</h2>
            <p className="signin-subtitle">Sign in to manage your banquet bookings</p>
          </div>
          <div className="signin-card">
            <h3 className="signin-form-title">Sign In</h3>
            <p className="signin-form-subtitle">Enter your credentials to access your account</p>
            <form onSubmit={handleSubmit} className="signin-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                <a href="#forgot" className="forgot-password">Forgot Password?</a>
              </div>
              <button type="submit" className="signin-button">Sign In</button>
            </form>
            <div className="signin-footer">
              <p>Don't have an account? <a href="/signup" className="signup-link">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn

