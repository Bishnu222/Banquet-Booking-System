import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ImageWithFallback } from "../image/ImageWithFallback";
import './MyBookings.css';

function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my');
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking request?")) return;

        try {
            await api.delete(`/bookings/${id}`);
            setBookings(bookings.filter(b => b._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to cancel booking");
        }
    };



    // Edit State
    const [editingBooking, setEditingBooking] = useState(null); // The booking object being edited
    const [editDate, setEditDate] = useState('');
    const [editGuests, setEditGuests] = useState('');

    const startEditing = (booking) => {
        setEditingBooking(booking._id);
        // Format date for input: YYYY-MM-DD
        const dateStr = booking.date ? new Date(booking.date).toISOString().split('T')[0] : '';
        setEditDate(dateStr);
        setEditGuests(booking.guestCount || '');
    };

    const cancelEditing = () => {
        setEditingBooking(null);
        setEditDate('');
        setEditGuests('');
    };

    const handleUpdateBooking = async (id) => {
        try {
            const res = await api.put(`/bookings/${id}`, {
                date: editDate,
                guestCount: parseInt(editGuests)
            });

            // Update local state
            setBookings(bookings.map(b => b._id === id ? { ...b, ...res.data, venue: b.venue } : b));
            setEditingBooking(null);
            alert("Booking updated successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to update booking");
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    if (loading) return <div className="bookings-loading">Loading your bookings...</div>;

    return (
        <div className="my-bookings-page">
            <nav className="bookings-nav">
                <button onClick={() => navigate('/home')} className="back-btn-simple">
                    &larr; Back to Home
                </button>
                <h1>My Bookings</h1>
            </nav>

            <div className="bookings-container">
                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <p>You haven't made any bookings yet.</p>
                        <button onClick={() => navigate('/venues')} className="browse-btn">
                            Browse Venues
                        </button>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="booking-card-item">
                                <div className="booking-img-wrapper">
                                    <ImageWithFallback
                                        src={getImageUrl(booking.venue?.images?.[0])}
                                        alt={booking.venue?.name || "Venue"}
                                        className="booking-thumb"
                                    />
                                </div>
                                <div className="booking-details">
                                    {booking.venue ? (
                                        <>
                                            <h2>{booking.venue.name}</h2>
                                            <p className="booking-location">📍 {booking.venue.location}</p>
                                            <div className="booking-meta">
                                                {editingBooking === booking._id ? (
                                                    <div className="edit-form-inline" style={{ marginTop: '10px' }}>
                                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                            <input
                                                                type="date"
                                                                value={editDate}
                                                                onChange={(e) => setEditDate(e.target.value)}
                                                                style={{ padding: '5px' }}
                                                            />
                                                            <input
                                                                type="number"
                                                                value={editGuests}
                                                                onChange={(e) => setEditGuests(e.target.value)}
                                                                placeholder="Guests"
                                                                style={{ padding: '5px', width: '80px' }}
                                                            />
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button onClick={() => handleUpdateBooking(booking._id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                                                            <button onClick={cancelEditing} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p style={{ margin: '4px 0', color: '#444' }}>
                                                            📅 Date: {booking.date ? new Date(booking.date).toLocaleDateString() : 'Not set'}
                                                        </p>
                                                        <p style={{ margin: '4px 0', color: '#444' }}>
                                                            👥 Guests: {booking.guestCount || 'N/A'}
                                                        </p>
                                                        <span className="booking-date">
                                                            Requested on: {new Date(booking.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="venue-removed-msg">Venue no longer exists</p>
                                    )}
                                </div>
                                <div className="booking-status-side">
                                    <span className={`status-badge ${booking.status || 'pending'}`}>
                                        {booking.status || 'Pending'}
                                    </span>
                                    {(!booking.status || booking.status === 'pending') && (
                                        <>
                                            {!editingBooking && (
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => startEditing(booking)}
                                                    style={{ marginBottom: '8px', background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', width: '100%' }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                className="cancel-btn"
                                                onClick={() => handleCancelBooking(booking._id)}
                                            >
                                                Cancel Request
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
