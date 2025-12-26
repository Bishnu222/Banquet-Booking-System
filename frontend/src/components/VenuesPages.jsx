import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "../image/ImageWithFallback";
import "./VenuesPages.css";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export function VenuesPage({ onNavigateBack }) {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventType, setSelectedEventType] = useState("All");
  const [selectedCapacity, setSelectedCapacity] = useState("All");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get('/venues');
        setVenues(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleBookVenue = (venueId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin', { state: { from: `/book/${venueId}` } });
      return;
    }
    navigate(`/book/${venueId}`);
  };

  const handleViewDetails = (venueId) => {

    navigate(`/venues/${venueId}`);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const eventTypes = ["All", "Wedding", "Corporate Event"];
  const capacityRanges = ["All", "500-1000 guests"];

  if (loading) return <div className="venues-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Venues...</div>;

  return (
    <div className="venues-page">

      <section className="venues-hero">
        <h1 className="hero-title">Explore Our Venues</h1>
        <p className="hero-text">
          Find the perfect venue for your special event in Nepal
        </p>
      </section>


      <section className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label className="filter-label">Event Type</label>
            <select className="filter-select">
              <option>All</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Capacity</label>
            <select className="filter-select">
              <option>All</option>
            </select>
          </div>
        </div>
      </section>


      <section className="venues-grid-section">
        <div className="venues-grid">
          {venues.map(venue => (
            <div key={venue._id} className="venue-card">
              <div className="venue-image-container">
                <ImageWithFallback
                  src={getImageUrl(venue.images?.[0])}
                  alt={venue.name}
                />
              </div>
              <div className="venue-content">
                <h3 className="venue-name">{venue.name}</h3>
                <div className="venue-location">

                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{venue.location}</span>
                </div>

                <p className="venue-desc">{venue.description}</p>

                <div className="venue-stats-row">
                  <div className="stat-item">

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{venue.capacity}</span>
                  </div>
                  <div className="stat-item">

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{venue.priceRange}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-book" onClick={() => handleBookVenue(venue._id)}>
                    Book Now
                  </button>
                  <button className="btn-details" onClick={() => handleViewDetails(venue._id)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
                  <button className="footer-link-btn" onClick={() => navigate('/venues')}>
                    Wedding Venues
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h5 className="footer-heading">Company</h5>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={() => navigate('/about')}>About Us</button></li>
                <li><button className="footer-link-btn" onClick={() => navigate('/terms')}>Terms & Conditions</button></li>
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