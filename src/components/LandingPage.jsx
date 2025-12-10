import React from "react";
import { ImageWithFallback } from "../image/ImageWithFallback";
import './LandingPage.css';

export function LandingPage({ onNavigateToLogin, onNavigateToSignUp, onNavigateToVenues }) {
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
              <div className="feature-icon blue">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-description">
                Simple and intuitive booking process in just a few clicks
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon purple">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="feature-title">Multiple Venues</h3>
              <p className="feature-description">
                Choose from our selection of premium banquet halls
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon green">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="feature-title">Real-time Availability</h3>
              <p className="feature-description">
                Check availability and book your preferred date instantly
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon amber">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
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
            <div className="venue-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1751891076198-f1162574c39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYmFucXVldCUyMGludGVyaW9yfGVufDF8fHx8MTc2NDA5NTMwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Silver Oak venue"
                className="venue-image"
              />
              <div className="venue-overlay">
                <div className="venue-info">
                  <h3 className="venue-name">Silver Oak</h3>
                  <p className="venue-description">Elegant space for intimate gatherings</p>
                </div>
              </div>
            </div>
            <div className="venue-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758597340435-c6ac65a88e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWxscm9vbSUyMGV2ZW50fGVufDF8fHx8MTc2Mzk3NDMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Imperial Banquet"
                className="venue-image"
              />
              <div className="venue-overlay">
                <div className="venue-info">
                  <h3 className="venue-name">Imperial Banquet</h3>
                  <p className="venue-description">Sophisticated venue for corporate events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">Everything You Need for a Perfect Event</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <svg className="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <div>
                    <h4 className="benefit-title">Flexible Packages</h4>
                    <p className="benefit-description">Customizable options to fit your budget and requirements</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <svg className="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <div>
                    <h4 className="benefit-title">Premium Catering</h4>
                    <p className="benefit-description">Gourmet dining options prepared by expert chefs</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <svg className="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <div>
                    <h4 className="benefit-title">State-of-the-Art Facilities</h4>
                    <p className="benefit-description">Modern AV equipment and amenities included</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <svg className="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <div>
                    <h4 className="benefit-title">Professional Event Planning</h4>
                    <p className="benefit-description">Expert coordinators to manage every detail</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <svg className="benefit-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div>
                    <h4 className="benefit-title">Prime Locations</h4>
                    <p className="benefit-description">Convenient venues accessible to all your guests</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-image">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1675247488725-22d1b78e75db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYW5xdWV0JTIwaGFsbHxlbnwxfHx8fDE3NjQwNTYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Banquet facilities"
                className="benefits-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Plan Your Event?</h2>
            <p className="cta-subtitle">
              Join hundreds of satisfied customers who trusted us with their special moments
            </p>
            <button className="cta-button" onClick={onNavigateToSignUp}>
              Start Booking Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-column">
              <h4 className="footer-title">Banquet Booking</h4>
              <p className="footer-text">
                Your trusted partner for memorable events and celebrations
              </p>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Services</h5>
              <ul className="footer-links">
                <li><a href="#">Wedding Venues</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5 className="footer-heading">Legal</h5>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

