import React, { useEffect, useState } from "react";
import { ImageWithFallback } from "../image/ImageWithFallback";
import './LandingPage.css';

export function LandingPage({ onNavigateToLogin, onNavigateToSignUp, onNavigateToVenues, onNavigateToOwnerSignup }) {


  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-logo">
              <h3>Banquet Booking</h3>
            </div>
            <div className="nav-buttons">
              <button className="nav-button ghost" onClick={onNavigateToLogin}>
                Sign In
              </button>
              <button className="nav-button primary" onClick={onNavigateToSignUp}>Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1675247488725-22d1b78e75db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYW5xdWV0JTIwaGFsbHxlbnwxfHx8fDE3NjQwNTYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Luxury banquet hall"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Your Perfect Event Starts Here</h1>
          <p className="hero-subtitle">
            Book elegant banquet halls for weddings, corporate events, and special celebrations
          </p>
          <div className="hero-buttons">
            <button className="hero-button primary" onClick={onNavigateToSignUp}>
              Book Your Event
            </button>
            <button className="hero-button outline" onClick={onNavigateToVenues}>
              View Venues
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-description">
              We make event planning effortless with our comprehensive booking system
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-description">
                Simple and intuitive booking process in just a few clicks
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Multiple Venues</h3>
              <p className="feature-description">
                Choose from our selection of premium banquet halls
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Real-time Availability</h3>
              <p className="feature-description">
                Check availability and book your preferred date instantly
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Premium Service</h3>
              <p className="feature-description">
                Dedicated support team to help plan your perfect event
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Gallery Section */}
      <section className="venues-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Our Venues in Nepal</h2>
            <p className="section-description">
              Explore our elegant spaces across Kathmandu and beyond
            </p>
          </div>
          <div className="venues-grid">
            <div className="venue-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1763231575952-98244918f99b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3lhbCUyMGJhbnF1ZXQlMjBoYWxsfGVufDF8fHx8MTc2NDA5NTMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Royal Place Banquet"
                className="venue-image"
              />
              <div className="venue-overlay">
                <div className="venue-info">
                  <h3 className="venue-name">Royal Place Banquet</h3>
                  <p className="venue-description">Perfect for grand celebrations and weddings</p>
                </div>
              </div>
            </div>
            <div className="venue-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1555789766-10dfb507a0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWolMjBob3RlbCUyMGJhbGxyb29tfGVufDF8fHx8MTc2NDA5NTMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Taaj Banquet"
                className="venue-image"
              />
              <div className="venue-overlay">
                <div className="venue-info">
                  <h3 className="venue-name">Taaj</h3>
                  <p className="venue-description">Luxury venue with premium amenities</p>
                </div>
              </div>
            </div>
            {/* More cards can be added if needed */}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-column brand-column">
              <h4 className="footer-title">Banquet Booking</h4>
              <p className="footer-text">
                Your trusted partner for memorable events and celebrations
              </p>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Service</h5>
              <ul className="footer-links">
                <li><a href="#">Wedding Venues</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Legal</h5>
              <ul className="footer-links">
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

