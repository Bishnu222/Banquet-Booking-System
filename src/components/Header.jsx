import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-circle">
            <span className="logo-icon">🏛️</span>
          </div>
          <span className="logo-text">Banquet Booking</span>
        </Link>
        <nav className="nav">
          <Link to="/signin" className="sign-in-link">Sign in</Link>
          <button className="get-started-btn">Get Started</button>
        </nav>
      </div>
    </header>
  )
}

export default Header

