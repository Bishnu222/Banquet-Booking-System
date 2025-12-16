import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "../image/ImageWithFallback";
import "./VenuesPages.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

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

  const handleBookVenue = async (venueId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (window.confirm("You need to sign in to book a venue. Go to Sign In?")) {
        navigate('/signin');
      }
      return;
    }

    try {
      await api.post('/bookings', { venueId });
      alert("Booking request sent successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Booking failed");
    }
  };

  const eventTypes = ["All", "Wedding", "Corporate Event"];
  const capacityRanges = ["All", "500-1000 guests"];

  if (loading) return <div className="venues-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Venues...</div>;

  return (
    <div className="venues-page">
      {/* Navigation */}
      <nav className="venues-nav">
        <button onClick={onNavigateBack} className="back-button">
          {/* Simple Left Arrow */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="venues-hero">
        <h1 className="hero-title">Explore Our Venues</h1>
        <p className="hero-text">
          Find the perfect venue for your special event in Nepal
        </p>
      </section>

      {/* Filters Section */}
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

      {/* Venues Grid */}
      <section className="venues-grid-section">
        <div className="venues-grid">
          {venues.map(venue => (
            <div key={venue._id} className="venue-card">
              <div className="venue-image-container">
                <ImageWithFallback
                  src={venue.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={venue.name}
                />
              </div>
              <div className="venue-content">
                <h3 className="venue-name">{venue.name}</h3>
                <div className="venue-location">
                  {/* Location Pin Icon */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{venue.location}</span>
                </div>

                <p className="venue-desc">{venue.description}</p>

                <div className="venue-stats-row">
                  <div className="stat-item">
                    {/* People/Guests Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{venue.capacity}</span>
                  </div>
                  <div className="stat-item">
                    {/* Calendar/Event/Price Icon */}
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
                  <button className="btn-details" onClick={() => navigate(`/venues/${venue._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="venues-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>Banquet Booking</h4>
            <p className="footer-text">
              Your trusted partner for memorable events and celebrations
            </p>
          </div>
          <div className="footer-col">
            <h5>Service</h5>
            <ul className="footer-links">
              <li><a href="#">Wedding Venues</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <ul className="footer-links">
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}