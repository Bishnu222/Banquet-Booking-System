import React, { useEffect, useState } from "react";
import { ImageWithFallback } from "../image/ImageWithFallback";
import api from "../api";
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

export function UserDashboard() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ideally get from context or local storage
    const userName = "Users";

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await api.get('/venues');
                setVenues(res.data.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchVenues();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="dashboard-theme">
            {/* Navigation */}
            <nav className="dashboard-nav">
                <div className="nav-left">
                    <div className="nav-logo-circle">
                        <img src="https://via.placeholder.com/40" alt="Logo" className="logo-img" />
                    </div>
                </div>
                <div className="nav-center">
                    <a href="#" className="nav-link active">Dashboard</a>
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/venues'); }}>Venues</a>
                    <a href="#" className="nav-link">My Bookings</a>
                </div>
                <div className="nav-right">
                    <button className="icon-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </button>
                    <button className="icon-btn profile-btn" onClick={handleLogout} title="Logout">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                <header className="welcome-header">
                    <h1>Welcome back, {userName}</h1>
                    <p className="welcome-subtitle">Discover and book the perfect venue for your special event</p>
                </header>

                <section className="action-cards">
                    {/* New Booking Card */}
                    <div className="action-card" onClick={() => navigate('/venues')}>
                        <div className="icon-box blue-soft">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </div>
                        <h3>New Booking</h3>
                        <p>Book a venue for your event</p>
                    </div>

                    {/* My Bookings Card */}
                    <div className="action-card">
                        <div className="icon-box purple-soft">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <h3>My Bookings</h3>
                        <p>View and manage bookings</p>
                    </div>

                    {/* Browse Venue Card */}
                    <div className="action-card" onClick={() => navigate('/venues')}>
                        <div className="icon-box green-soft">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                        <h3>Browse Venue</h3>
                        <p>Explore available venue</p>
                    </div>
                </section>

                <section className="featured-venues">
                    <h2 className="section-title">Feature venues</h2>
                    <p className="section-subtitle">Premium venues for your special occasions</p>

                    <div className="venues-grid-horizontal">
                        {venues.map(venue => (
                            <div key={venue._id} className="venue-card-minimal">
                                <div className="venue-img-wrapper">
                                    <ImageWithFallback src={venue.images?.[0]} alt={venue.name} className="venue-img" />
                                </div>
                                <div className="venue-info-minimal">
                                    <h4>{venue.name}</h4>
                                    <p>{venue.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
