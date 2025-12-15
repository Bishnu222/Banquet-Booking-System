import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './OwnerDashboard.css';

function OwnerDashboard() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'venues', 'bookings'
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        priceRange: '',
        description: '',
        images: [] // Array of File objects
    });

    useEffect(() => {
        fetchMyVenues();
    }, []);

    const fetchMyVenues = async () => {
        try {
            const res = await api.get('/venues/my-venues');
            setVenues(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('location', formData.location);
            data.append('capacity', formData.capacity);
            data.append('priceRange', formData.priceRange);
            data.append('description', formData.description);

            for (let i = 0; i < formData.images.length; i++) {
                data.append('images', formData.images[i]);
            }

            await api.post('/venues', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowAddModal(false);
            fetchMyVenues();
            setFormData({
                name: '',
                location: '',
                capacity: '',
                priceRange: '',
                description: '',
                images: []
            });
            setActiveTab('venues');
        } catch (err) {
            console.error(err);
            alert("Failed to add venue. Please check your inputs.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this venue? This cannot be undone.")) {
            try {
                await api.delete(`/venues/${id}`);
                fetchMyVenues();
            } catch (err) {
                alert("Failed to delete venue");
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/');
        }
    };

    // Calculated Stats
    const totalVenues = venues.length;
    const totalCapacity = venues.reduce((acc, v) => acc + (parseInt(v.capacity) || 0), 0);
    // Mock data for things we don't have yet
    const activeBookings = Math.floor(totalVenues * 1.5);
    const monthlyRevenue = totalVenues * 1500;

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="owner-dashboard">
            {/* Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        Banquet<span>Partner</span>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div
                        className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'venues' ? 'active' : ''}`}
                        onClick={() => setActiveTab('venues')}
                    >
                        My Venues
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'venues' && 'Manage Venues'}
                            {activeTab === 'bookings' && 'Booking Requests'}
                            {activeTab === 'settings' && 'Account Settings'}
                        </h1>
                        <p>Welcome back</p>
                    </div>

                    {activeTab === 'venues' && (
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                            + Add New Venue
                        </button>
                    )}
                </header>

                {/* Dashboard Overview Content */}
                {activeTab === 'overview' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-info">
                                    <h3>Total Venues</h3>
                                    <p className="stat-value">{totalVenues}</p>
                                </div>
                                <div className="stat-icon">🏢</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info">
                                    <h3>Active Bookings</h3>
                                    <p className="stat-value">{activeBookings}</p>
                                </div>
                                <div className="stat-icon">📅</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info">
                                    <h3>Est. Revenue</h3>
                                    <p className="stat-value">${monthlyRevenue}</p>
                                </div>
                                <div className="stat-icon">💰</div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h2>Recent Venues</h2>
                            <div className="venues-grid">
                                {venues.slice(0, 3).map(venue => (
                                    <VenueCard key={venue._id} venue={venue} onDelete={handleDelete} />
                                ))}
                                {venues.length === 0 && <p className="no-data">No venues listed yet.</p>}
                            </div>
                        </div>
                    </>
                )}

                {/* Venues Tab Content */}
                {activeTab === 'venues' && (
                    <div className="venues-grid">
                        {venues.map(venue => (
                            <VenueCard key={venue._id} venue={venue} onDelete={handleDelete} />
                        ))}
                        {venues.length === 0 && (
                            <div className="empty-state">
                                <p>You haven't listed any venues yet.</p>
                                <button className="btn-primary" onClick={() => setShowAddModal(true)}>Add Your First Venue</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Bookings Tab Placeholder */}
                {activeTab === 'bookings' && (
                    <div className="message-box">
                        <h3>Booking Management System</h3>
                        <p>This feature will allow you to accept/reject booking requests.</p>
                    </div>
                )}

                {/* Settings Tab Placeholder */}
                {activeTab === 'settings' && (
                    <div className="message-box">
                        <h3>Profile Settings</h3>
                        <p>Manage your business profile and notification preferences.</p>
                    </div>
                )}

            </main>

            {/* Add Venue Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Venue</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Venue Name</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Grand Ballroom" />
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input name="location" value={formData.location} onChange={handleInputChange} required placeholder="City, Area" />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Capacity (Guests)</label>
                                    <input name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} required placeholder="e.g. 500" />
                                </div>
                                <div className="form-group">
                                    <label>Price Range</label>
                                    <input name="priceRange" value={formData.priceRange} onChange={handleInputChange} required placeholder="e.g. $1000 - $5000" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Describe your venue..." />
                            </div>

                            <div className="form-group">
                                <label>Venue Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ padding: '0.5rem' }}
                                />
                                <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>Select up to 5 images</small>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Publish Venue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component for clean code
function VenueCard({ venue, onDelete }) {
    return (
        <div className="venue-card">
            <img
                src={venue.images && venue.images.length > 0
                    ? `http://localhost:5000${venue.images[0]}`
                    : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={venue.name}
                className="venue-image"
            />
            <div className="venue-details">
                <h3>{venue.name}</h3>
                <div className="venue-location">
                    <span>📍</span> {venue.location}
                </div>
                <div className="venue-stats">
                    <div className="v-stat">
                        Capacity
                        <span>{venue.capacity}</span>
                    </div>
                    <div className="v-stat">
                        Price
                        <span>{venue.priceRange}</span>
                    </div>
                </div>
            </div>
            <div className="card-actions">
                <button className="btn-icon delete" onClick={() => onDelete(venue._id)}>
                    🗑️ Remove
                </button>
            </div>
        </div>
    );
}

export default OwnerDashboard;
