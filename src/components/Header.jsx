import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-circle">
            <span className="logo-icon">🏛️</span>
          </div>
          <span className="logo-text">Banquet Booking</span>
        </div>
        <nav className="nav">
          <a href="#signin" className="sign-in-link">Sign in</a>
          <button className="get-started-btn">Get Started</button>
        </nav>
      </div>
    </header>
  )
}

export default Header

