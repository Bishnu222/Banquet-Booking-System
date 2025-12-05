import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Your Perfect Event Starts Here</h1>
          <p className="hero-subtitle">
            Book elegant banquet halls for weddings, corporate events, and special celebrations
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Book Your Event</button>
            <button className="btn-secondary">View Venues</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

