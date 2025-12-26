import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ImageWithFallback } from "../image/ImageWithFallback";
import './LandingPage.css';
import logo from '../assets/logo.png';
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1675247488725-22d1b78e75db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYW5xdWV0JTIwaGFsbHxlbnwxfHx8fDE3NjQwNTYxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80"
];

export function LandingPage({ onNavigateToLogin, onNavigateToSignUp, onNavigateToVenues, onNavigateToOwnerSignup, onNavigateToAbout, onNavigateToTerms }) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredVenues, setFeaturedVenues] = useState([]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  useEffect(() => {
    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const fetchFeaturedVenues = async () => {
      try {
        const response = await api.get('/venues/featured');
        setFeaturedVenues(response.data);
      } catch (error) {
        console.error("Failed to fetch featured venues:", error);
      }
    };

    fetchFeaturedVenues();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Image slider interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal observer - dependent on content loading
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach(el => observer.observe(el));

    return () => {
      hiddenElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [featuredVenues]); // Re-run when venues are loaded

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-logo">
              <img src={logo} alt="Banquet Booking" className="logo-image" />
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
        {HERO_IMAGES.map((src, index) => (
          <ImageWithFallback
            key={src}
            src={src}
            alt={`Luxury banquet hall ${index + 1}`}
            className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-content">

          <h1 className="hero-title">Your Perfect Event Starts Here</h1>
          <p className="hero-subtitle">
            Discover and book elegant banquet halls for weddings, corporate events, and special celebrations with ease.
          </p>
          <div className="hero-buttons">
            <button className="hero-button primary" onClick={onNavigateToVenues}>
              Book Your Event
            </button>
            <button className="hero-button outline" onClick={onNavigateToVenues}>
              View All Venues
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-description">
              We make event planning effortless with our comprehensive booking system designed for your convenience.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-description">
                Simple and intuitive booking process in just a few clicks. No hassle, just celebration.
              </p>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="feature-title">Premium Venues</h3>
              <p className="feature-description">
                Choose from our carefully curated selection of premium banquet halls across the country.
              </p>
            </div>
            <div className="feature-card reveal reveal-delay-3">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="feature-title">Real-time Availability</h3>
              <p className="feature-description">
                Check availability instantly and book your preferred date without waiting for confirmation.
              </p>
            </div>
            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-title">Secure & Reliable</h3>
              <p className="feature-description">
                Secure payments and a dedicated support team to help plan your perfect event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Gallery Section */}
      <section className="venues-section">
        <div className="section-container">
          <div className="section-header reveal">
            <h2 className="section-title">Our Featured Venues</h2>
            <p className="section-description">
              Explore our most elegant and highly-rated spaces across the city.
            </p>
          </div>
          <div className="venues-grid">
            {featuredVenues.length > 0 ? (
              featuredVenues.map((venue, index) => (
                <div
                  key={venue._id}
                  className={`venue-card reveal reveal-delay-${(index % 3) + 1}`}
                  onClick={() => navigate(`/venues/${venue._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="venue-image-wrapper">
                    <ImageWithFallback
                      src={getImageUrl(venue.images && venue.images.length > 0 ? venue.images[0] : null)}
                      alt={venue.name}
                      className="venue-image"
                    />
                  </div>
                  <div className="venue-details">
                    <div className="venue-top-meta">
                      {/* Rating can be added here if available in the future */}
                      <span className="venue-rating">Featured</span>
                    </div>
                    <h3 className="venue-name">{venue.name}</h3>
                    <div className="venue-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span>{venue.location}</span>
                    </div>
                    <div className="venue-tags">
                      {venue.eventTypes && venue.eventTypes.length > 0 && (
                        <span className="venue-tag">{venue.eventTypes[0]}</span>
                      )}
                      <span className="venue-tag">{venue.capacity} Guests</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-venues-msg">No featured venues available at the moment.</p>
            )}
          </div>
          <div className="venues-cta reveal">
            <button className="secondary-button" onClick={onNavigateToVenues}>View All Spaces</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section reveal">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-icon">❝</div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"The experience was seamless from start to finish. The venue was exactly as described and the support team was amazing!"</p>
              <div className="testimonial-author">
                <div className="author-avatar-img" style={{ backgroundImage: 'url(https://cdn-icons-png.flaticon.com/512/5719/5719511.png)' }}></div>
                <div className="author-info">
                  <span className="author-name">Safal Rana</span>

                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-icon">❝</div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"We booked a venue and everything was perfect.  Highly  recommend for professional gatherings."</p>
              <div className="testimonial-author">
                <div className="author-avatar-img" style={{ backgroundImage: 'url(https://cdn-icons-png.freepik.com/512/6218/6218538.png)' }}></div>
                <div className="author-info">
                  <span className="author-name">James Shrestha</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-icon">❝</div>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"Found the perfect venue for our anniversary within minutes. The booking process was transparent and easy."</p>
              <div className="testimonial-author">
                <div className="author-avatar-img" style={{ backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOuxrvcNMfGLh73uKP1QqYpKoCB0JLXiBMvA&s)' }}></div>
                <div className="author-info">
                  <span className="author-name">Suraj Tamang</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Section */}
      <section className="host-section reveal">
        <div className="host-content">
          <h2 className="host-title">Are you a venue owner?</h2>
          <p className="host-description">
            List your venue on our platform and reach thousands of potential customers looking for the perfect space for their event.
          </p>
          <button className="host-button" onClick={onNavigateToOwnerSignup}>
            List Your Venue
          </button>
        </div>
        <div className="host-image-container">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80"
            alt="Luxury Venue Interior"
            className="host-image"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-column brand-column">
              <h4 className="footer-title">Banquet Booking</h4>
              <p className="footer-text">
                Your trusted partner for memorable events. We connect you with the best venues to make your celebration extraordinary.
              </p>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Services</h5>
              <ul className="footer-links">
                <li>
                  <button className="footer-link-btn" onClick={onNavigateToVenues}>
                    Wedding Venues
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={onNavigateToAbout}>About Us</button></li>
                <li><button className="footer-link-btn" onClick={onNavigateToTerms}>Terms & Conditions</button></li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Contact</h5>
              <ul className="footer-links">
                <li><a href="mailto:support@banquetbooking.com">support@banquetbooking.com</a></li>
                <li><a href="tel:+9771234567890">+977 1234567890</a></li>
                <li><span>Kathmandu, Nepal</span></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Banquet Booking System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

