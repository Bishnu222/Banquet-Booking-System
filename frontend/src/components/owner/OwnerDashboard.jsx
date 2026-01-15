import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import NotificationDropdown from '../shared/NotificationDropdown';
import AvailabilityCalendar from '../shared/AvailabilityCalendar';
import OwnerProfile from './OwnerProfile';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [venues, setVenues] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalVenues: 0,
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        totalEarnings: 0
    });
    const [reviews, setReviews] = useState([]);
    const [showVenueModal, setShowVenueModal] = useState(false);
    const [editingVenue, setEditingVenue] = useState(null);
    const [venueForm, setVenueForm] = useState({
        name: '',
        location: '',
        capacity: '',
        pricePerGuest: '',
        priceRange: '',
        description: '',
        images: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedVenueForCalendar, setSelectedVenueForCalendar] = useState(null);

    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [venuesRes, bookingsRes, reviewsRes] = await Promise.all([
                api.get('/owner/venues'),
                api.get('/owner/bookings'),
                api.get('/owner/reviews')
            ]);

            setVenues(venuesRes.data);
            setBookings(bookingsRes.data);
            setReviews(reviewsRes.data);

            // Calculate stats
            setStats({
                totalVenues: venuesRes.data.length,
                totalBookings: bookingsRes.data.length,
                confirmedBookings: bookingsRes.data.filter(b => b.status === 'confirmed').length,
                pendingBookings: bookingsRes.data.filter(b => b.status === 'pending').length,
                totalEarnings: bookingsRes.data
                    .filter(b => b.status === 'confirmed')
                    .reduce((acc, b) => acc + (b.totalPrice || 0), 0)
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            addToast('Error loading dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        addToast('Logged out successfully', 'success');
        navigate('/owner-login');
    };

    const handleVenueSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', venueForm.name);
            formData.append('location', venueForm.location);
            formData.append('capacity', venueForm.capacity);
            formData.append('pricePerGuest', venueForm.pricePerGuest);
            formData.append('priceRange', venueForm.priceRange);
            formData.append('description', venueForm.description);
            // Append event types
            if (venueForm.eventTypes && venueForm.eventTypes.length) {
                venueForm.eventTypes.forEach(type => formData.append('eventTypes', type));
            }

            if (venueForm.images) {
                for (let i = 0; i < venueForm.images.length; i++) {
                    formData.append('images', venueForm.images[i]);
                }
            }

            if (editingVenue) {
                await api.put(`/owner/venues/${editingVenue._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                addToast('Venue updated successfully', 'success');
            } else {
                await api.post('/owner/venues', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                addToast('Venue added successfully', 'success');
            }
            setShowVenueModal(false);
            fetchData();
        } catch (err) {
            addToast('Error saving venue', 'error');
        }
    };

    const handleReviewResponse = async (id, response) => {
        try {
            await api.patch(`/owner/reviews/${id}/respond`, { response });
            addToast('Response sent', 'success');
            fetchData();
        } catch (err) {
            addToast('Error sending response', 'error');
        }
    };

    const toggleDate = async (venueId, date, isRemove) => {
        try {
            const venue = venues.find(v => v._id === venueId);
            let updatedDates;
            if (isRemove) {
                updatedDates = venue.blockedDates.filter(d => d !== date);
            } else {
                if (venue.blockedDates?.includes(date)) return;
                updatedDates = [...(venue.blockedDates || []), date];
            }

            await api.patch(`/owner/venues/${venueId}/block-dates`, { blockedDates: updatedDates });
            addToast(`Availability updated`, 'success');
            fetchData();
        } catch (err) {
            addToast('Error updating availability', 'error');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/owner/bookings/${id}/status`, { status: newStatus });
            addToast(`Booking ${newStatus} successfully`, 'success');
            fetchData();
        } catch (err) {
            addToast('Failed to update status', 'error');
        }
    };

    if (loading) return <div className="loader">Loading Dashboard...</div>;

    return (
        <div className="owner-dashboard">
            <aside className="owner-sidebar">
                <div className="sidebar-brand">
                    <h2>Banquet Manager</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={activeTab === 'venues' ? 'active' : ''}
                        onClick={() => setActiveTab('venues')}
                    >
                        My Venues
                    </button>
                    <button
                        className={activeTab === 'bookings' ? 'active' : ''}
                        onClick={() => setActiveTab('bookings')}
                    >
                        Bookings
                    </button>
                    <button
                        className={activeTab === 'availability' ? 'active' : ''}
                        onClick={() => setActiveTab('availability')}
                    >
                        Availability
                    </button>
                    <button
                        className={activeTab === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                    <button
                        className={activeTab === 'profile' ? 'active' : ''}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="owner-content">
                <header className="content-header">
                    <h1>
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'venues' && 'Venue Management'}
                        {activeTab === 'bookings' && 'Booking Requests'}
                        {activeTab === 'availability' && 'Calendar & Availability'}
                        {activeTab === 'reviews' && 'Customer Reviews'}
                        {activeTab === 'profile' && 'My Profile'}
                    </h1>
                    <div className="header-actions">
                        {activeTab === 'venues' && (
                            <button className="create-btn" onClick={() => {
                                setEditingVenue(null);
                                setVenueForm({
                                    name: '',
                                    location: '',
                                    capacity: '',
                                    pricePerGuest: '',
                                    priceRange: '',
                                    description: '',
                                    images: []
                                });
                                setShowVenueModal(true);
                            }}>
                                + Add New Venue
                            </button>
                        )}
                        <NotificationDropdown />
                        <button className="refresh-btn" onClick={fetchData}>🔄 Refresh</button>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon icon-purple">🏛️</div>
                                </div>
                                <span className="stat-label">Total Venues</span>
                                <span className="stat-value">{stats.totalVenues}</span>
                            </div>
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon icon-blue">📅</div>
                                </div>
                                <span className="stat-label">Total Bookings</span>
                                <span className="stat-value">{stats.totalBookings}</span>
                            </div>
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon icon-green">💰</div>
                                </div>
                                <span className="stat-label">Total Earnings</span>
                                <span className="stat-value">NPR {stats.totalEarnings.toLocaleString()}</span>
                            </div>
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon icon-orange">⏳</div>
                                </div>
                                <span className="stat-label">Pending Requests</span>
                                <span className="stat-value">{stats.pendingBookings}</span>
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="section-header">
                                <h3>Recent Bookings</h3>
                                <button className="action-btn view" onClick={() => setActiveTab('bookings')}>View All</button>
                            </div>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Venue</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.slice(0, 5).map(booking => (
                                            <tr key={booking._id}>
                                                <td>#{booking._id.slice(-6).toUpperCase()}</td>
                                                <td>{booking.venue?.name}</td>
                                                <td>{booking.user?.name}</td>
                                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge ${booking.status}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="empty-row" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No recent bookings found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'venues' && (
                    <div className="venues-grid">
                        {venues.map(venue => (
                            <div className="venue-card-small" key={venue._id}>
                                <div className="venue-img-container">
                                    <img src={venue.images?.[0] ? `http://localhost:5000${venue.images[0]}` : 'https://via.placeholder.com/300x200'} alt={venue.name} />
                                    <div className="venue-overlay">
                                        <button className="action-btn edit" onClick={() => {
                                            setEditingVenue(venue);
                                            setVenueForm({
                                                name: venue.name,
                                                location: venue.location,
                                                capacity: venue.capacity,
                                                pricePerGuest: venue.pricePerGuest,
                                                priceRange: venue.priceRange,
                                                description: venue.description,
                                                images: []
                                            });
                                            setShowVenueModal(true);
                                        }}>Edit Venue</button>
                                    </div>
                                </div>
                                <div className="venue-info">
                                    <h3>{venue.name}</h3>
                                    <p>📍 {venue.location}</p>
                                    <p>👥 Capacity: {venue.capacity}</p>
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 600, color: '#0ea5e9' }}>⭐ {venue.averageRating || 'New'}</span>
                                        <button className="action-btn view" onClick={() => navigate(`/venues/${venue._id}`)}>View Page</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {venues.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
                                <p style={{ color: '#64748b', marginBottom: '1rem' }}>You haven't added any venues yet.</p>
                                <button className="create-btn" onClick={() => setShowVenueModal(true)}>+ Add First Venue</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <div className="filter-controls">
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="status-select"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Venue</th>
                                        <th>Customer</th>
                                        <th>Date & Time</th>
                                        <th>Guests</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings
                                        .filter(b => {
                                            const matchesSearch =
                                                b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                b.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
                                            return matchesSearch && matchesStatus;
                                        })
                                        .map(booking => (
                                            <tr key={booking._id}>
                                                <td>{booking.venue?.name}</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <strong style={{ fontSize: '0.9rem' }}>{booking.user?.name}</strong>
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.user?.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {new Date(booking.date).toLocaleDateString()}<br />
                                                    <small style={{ color: '#64748b' }}>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                                </td>
                                                <td>{booking.guestCount}</td>
                                                <td>NPR {booking.totalPrice?.toLocaleString()}</td>
                                                <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                                                <td>
                                                    {booking.status === 'pending' && (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                className="action-btn"
                                                                style={{ color: '#166534', background: '#dcfce7' }}
                                                                onClick={() => updateStatus(booking._id, 'confirmed')}
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                className="action-btn"
                                                                style={{ color: '#991b1b', background: '#fee2e2' }}
                                                                onClick={() => updateStatus(booking._id, 'cancelled')}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {bookings.length === 0 && (
                                        <tr><td colSpan="7" className="empty-row" style={{ textAlign: 'center', padding: '2rem' }}>No bookings found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'availability' && (
                    <div className="dashboard-section" style={{ padding: '2rem' }}>
                        {venues.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                {venues.map(venue => (
                                    <div key={venue._id}>
                                        <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem', fontWeight: 600 }}>
                                            {venue.name}
                                        </h3>
                                        <AvailabilityCalendar venueId={venue._id} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                <p>No venues found. Add a venue to see its booking calendar.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="dashboard-section" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <strong style={{ fontSize: '1rem', display: 'block' }}>{review.user?.name}</strong>
                                            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Venue: {review.venue?.name}</span>
                                        </div>
                                        <div style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{'★'.repeat(review.rating)}</div>
                                    </div>
                                    <p style={{ marginBottom: '1.5rem', color: '#334155' }}>"{review.comment}"</p>

                                    {review.ownerResponse ? (
                                        <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #166534' }}>
                                            <strong style={{ fontSize: '0.9rem', color: '#166534', display: 'block', marginBottom: '0.5rem' }}>Your Response:</strong>
                                            <p style={{ fontSize: '0.95rem', color: '#14532d' }}>{review.ownerResponse}</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            handleReviewResponse(review._id, e.target.response.value);
                                        }}>
                                            <textarea
                                                name="response"
                                                placeholder="Write a response..."
                                                required
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.5rem' }}
                                            ></textarea>
                                            <button type="submit" className="action-btn" style={{ background: '#0ea5e9', color: 'white' }}>Send Response</button>
                                        </form>
                                    )}
                                </div>
                            ))}
                            {reviews.length === 0 && <p style={{ textAlign: 'center', color: '#64748b' }}>No reviews found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <OwnerProfile />
                )}

            </main>

            {showVenueModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
                            <button className="action-btn view" onClick={() => setShowVenueModal(false)} style={{ fontSize: '1.5rem', padding: '0 10px' }}>&times;</button>
                        </div>
                        <form onSubmit={handleVenueSubmit}>
                            <div className="form-group">
                                <label>Venue Name</label>
                                <input
                                    type="text"
                                    value={venueForm.name}
                                    onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={venueForm.location}
                                        onChange={(e) => setVenueForm({ ...venueForm, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input
                                        type="number"
                                        value={venueForm.capacity}
                                        onChange={(e) => setVenueForm({ ...venueForm, capacity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Price Per Guest (NPR)</label>
                                    <input
                                        type="number"
                                        value={venueForm.pricePerGuest}
                                        onChange={(e) => setVenueForm({ ...venueForm, pricePerGuest: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price Range (Display Text)</label>
                                    <input
                                        type="text"
                                        value={venueForm.priceRange}
                                        onChange={(e) => setVenueForm({ ...venueForm, priceRange: e.target.value })}
                                        placeholder="e.g. 1 Lakh - 5 Lakh"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={venueForm.description}
                                    onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })}
                                    required
                                    rows="4"
                                />
                            </div>
                            <div className="form-group">
                                <label>Event Types</label>
                                <div className="event-types-container">
                                    {['Wedding', 'Corporate Event', 'Party', 'Anniversary', 'Conference'].map(type => (
                                        <div
                                            key={type}
                                            className={`event-type-chip ${venueForm.eventTypes?.includes(type) ? 'selected' : ''}`}
                                            onClick={() => {
                                                const current = venueForm.eventTypes || [];
                                                const isSelected = current.includes(type);
                                                let newTypes;
                                                if (isSelected) {
                                                    newTypes = current.filter(t => t !== type);
                                                } else {
                                                    newTypes = [...current, type];
                                                }
                                                setVenueForm({ ...venueForm, eventTypes: newTypes });
                                            }}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setVenueForm({ ...venueForm, images: e.target.files })}
                                />
                                {editingVenue && <small style={{ display: 'block', marginTop: '5px', color: '#64748b' }}>Leave empty to keep existing images</small>}
                            </div>
                            <div className="form-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowVenueModal(false)}
                                    className="action-btn"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: '#f1f5f9',
                                        color: '#64748b',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    style={{
                                        width: '100%',
                                        background: '#0ea5e9',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingVenue ? 'Update Venue' : 'Add Venue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
