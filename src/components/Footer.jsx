import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">Banquet Booking</h3>
            <p className="footer-text">
              Your trusted partner for memorable events and celebrations.
            </p>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Service</h3>
            <ul className="footer-links">
              <li><a href="#wedding">Wedding Venues</a></li>
              <li><a href="#corporate">Corporate Events</a></li>
              <li><a href="#celebration">Special Celebrations</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-links">
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Banquet Booking System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

