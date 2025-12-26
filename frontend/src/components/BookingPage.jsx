import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './BookingPage.css';

function BookingPage() {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [bookingDate, setBookingDate] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [eventType, setEventType] = useState('Wedding');
    const [eventTime, setEventTime] = useState('');
    const [duration, setDuration] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    const [error, setError] = useState('');


    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await api.get(`/venues/${venueId}`);
                setVenue(res.data);
                // Pre-fill some data if available
                setLoading(false);
            } catch (err) {
                console.error("Error fetching venue:", err);
                setError("Failed to load venue details.");
                setLoading(false);
            }
        };
        fetchVenue();
    }, [venueId]);

    const handleBooking = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            if (window.confirm("You must be logged in to book a venue. Go to Sign In?")) {
                navigate('/signin');
            }
            return;
        }

        try {

            await api.post('/bookings', {
                venueId,
                date: bookingDate,
                guestCount: parseInt(guestCount),
                // Potential future fields below
                eventType,
                eventTime,
                duration,
                contact: { fullName, email, phone },
                notes: specialRequests
            });
            alert("Booking request sent successfully!");
            navigate('/bookings');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || "Booking failed. Please try again.");
        }
    };

    if (loading) return <div className="booking-page-loading">Loading...</div>;
    if (!venue) return <div className="booking-page-error">{error || "Venue not found"}</div>;

    const totalPrice = venue.priceRange
        ? (parseInt(venue.priceRange.replace(/[^0-9]/g, '')) || 0)
        : 0;

    return (
        <div className="booking-page-container">
            {/* Header */}
            <div className="booking-header-nav">
                <div className="header-actions">
                    <span>Book your events</span>
                </div>
            </div>



            <div className="booking-layout">
                {/* Left Side: Form */}
                <div className="booking-form-section">
                    <form onSubmit={handleBooking}>
                        {error && <div className="booking-error-message">{error}</div>}
                        {/* Event Details Group */}
                        <div className="form-section-group">
                            <h3>Event Details</h3>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Event Type</label>
                                    <input
                                        type="text"
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                        placeholder="Weeding"
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>Event Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Event Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={eventTime}
                                        onChange={(e) => setEventTime(e.target.value)}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="e.g. 5 hours"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Number of Guests</label>
                                <input
                                    type="number"
                                    required
                                    className="full-width"
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(e.target.value)}
                                    placeholder="e.g. 150"
                                />
                            </div>
                        </div>

                        <hr className="divider" />

                        {/* Contact Info Group */}
                        <div className="form-section-group">
                            <h3>Contact Information</h3>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="full-width"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group half">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="divider" />

                        {/* Special Requests */}
                        <div className="form-section-group">
                            <h3>Special Requests</h3>
                            <div className="form-group">
                                <label>Additional Requirements (Optional)</label>
                                <textarea
                                    rows="4"
                                    placeholder="Any special requests, dietary requirements, or additional service needed..."
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <hr className="divider" />

                        <button type="submit" className="proceed-btn">
                            Proceed to Payment
                        </button>
                    </form>
                </div>

                {/* Right Side: Sidebar */}
                <div className="booking-sidebar">
                    {/* Booking Summary Card */}
                    <div className="sidebar-card summary-card">
                        <h4>Booking Summary</h4>
                        <div className="summary-image-container">
                            <img
                                src={venue.images && venue.images.length > 0
                                    ? `http://localhost:5000${venue.images[0]}`
                                    : 'https://via.placeholder.com/600x400?text=Venue'}
                                alt={venue.name}
                            />
                        </div>
                        <div className="summary-details">
                            <h5>{venue.name}</h5>
                            <div className="summary-stat">
                                <span>👥 Guests</span>
                                <p>{guestCount || '0'} People</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown Card */}
                    <div className="sidebar-card price-card">
                        <h4>Price Breakdown</h4>
                        <div className="price-row">
                            <span>Price Per Guest</span>
                            <span>Rs. {venue.pricePerGuest || 1200}</span>
                        </div>
                        <div className="price-row">
                            <span>Guest Count</span>
                            <span>{guestCount || '0'} guests</span>
                        </div>
                        <hr />
                        <div className="price-row total">
                            <span>Total Amount</span>
                            <span>Rs. {(parseInt(guestCount) || 0) * (venue.pricePerGuest || 1200)}</span>
                        </div>
                        <p className="price-note">*Final price calculated based on guest count.</p>
                    </div>

                    {/* What's Included Card */}
                    <div className="sidebar-card included-card">
                        <h4>What's Included</h4>
                        <ul className="included-list">
                            <li><span>✓</span> Venue rental</li>
                            <li><span>✓</span> Basic decoration</li>
                            <li><span>✓</span> Sound system</li>
                            <li><span>✓</span> Parking facilities</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
