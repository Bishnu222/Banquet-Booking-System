import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from "../shared/NotificationDropdown";
import './HomePage.css';
// Ideally replace with actual logo import
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export function HomePage() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user name from localStorage
  const userName = localStorage.getItem('userName') || "User";

  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, bookingsRes] = await Promise.all([
          api.get('/venues'),
          api.get('/bookings/my')
        ]);
        setVenues(venuesRes.data);
        setMyBookings(bookingsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-btn') && !event.target.closest('.dropdown-menu')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate('/');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div>Loading...</div>;

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate Real Stats
  const totalBookings = myBookings.length;
  const upcomingBookings = myBookings.filter(b => new Date(b.date) >= new Date()).length;

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="nav-brand">
          <img src={LOGO_URL} alt="Banquet Booking" />
        </div>

        <div className="nav-links">
          <span className="nav-link active" onClick={() => navigate('/home')}>Dashboard</span>
          <span className="nav-link" onClick={() => navigate('/venues')}>Browse Venues</span>
          <span className="nav-link" onClick={() => navigate('/bookings')}>My Bookings</span>
        </div>

        <div className="nav-right">
          <NotificationDropdown />

          <div className="profile-container-nav" style={{ position: 'relative' }}>
            <button
              className="icon-btn profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              title="Settings"
            >
              <div className="avatar-circle">
                {userName.charAt(0).toUpperCase()}
              </div>
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header-item">
                  {userName}
                </div>
                <div className="dropdown-item" onClick={() => navigate('/profile')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Profile Settings
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        {/* Welcome Header */}
        <section className="welcome-section">
          <h1>Welcome back, {userName}</h1>
          <p>Discover and book the perfect venue for your special event</p>
        </section>

        {/* Action Cards */}
        <section className="action-cards">
          {/* Card 1 */}
          <div className="action-card" onClick={() => navigate('/venues')}>
            <div className="card-icon icon-blue">
              <span>+</span>
            </div>
            <h3>New Booking</h3>
            <p>Book a venue for your event</p>
          </div>

          {/* Card 2 */}
          <div className="action-card" onClick={() => navigate('/bookings')}>
            <div className="card-icon icon-purple">
              <span>📅</span>
            </div>
            <h3>My Bookings</h3>
            <p>View and manage bookings</p>
          </div>

          {/* Card 3 */}
          <div className="action-card" onClick={() => navigate('/venues')}>
            <div className="card-icon icon-green">
              <span>🔍</span>
            </div>
            <h3>Browse Venue</h3>
            <p>Explore available venues</p>
          </div>
        </section>

        {/* Feature Venues */}
        <section className="featured-section">
          <h2>Feature venues</h2>
          <span className="section-subtitle">Premium venues for your special occasions</span>

          <div className="venues-grid">
            {venues.slice(0, 4).map(venue => (
              <div key={venue._id} className="venue-card-simple">
                <div className="venue-image-wrapper">
                  <img
                    src={getImageUrl(venue.images?.[0])}
                    alt={venue.name}
                    className="venue-image"
                  />
                </div>
                <div className="venue-info-simple">
                  <h4 className="venue-name">{venue.name}</h4>
                  <div className="venue-location">
                    <span>📍</span> {venue.location}
                  </div>
                  <button className="btn-details" onClick={() => navigate(`/venues/${venue._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
