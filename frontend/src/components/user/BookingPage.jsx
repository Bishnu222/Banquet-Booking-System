import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useToast } from '../../context/ToastContext';
import './BookingPage.css';

function BookingPage() {
    const { venueId } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

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
    const [selectedPackageId, setSelectedPackageId] = useState('');

    const [error, setError] = useState('');


    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

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

    useEffect(() => {
        const fetchOccupiedSlots = async () => {
            if (!bookingDate || !venueId) return;

            try {
                const res = await api.get(`/bookings/occupied?venueId=${venueId}&date=${bookingDate}`);
                const occupied = res.data; // Array of { startTime, endTime } or { fullDay: true }

                // Generate all 30-min slots for the day
                const allSlots = [];
                for (let h = 0; h < 24; h++) {
                    for (let m = 0; m < 60; m += 30) {
                        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                        allSlots.push(timeStr);
                    }
                }

                // Filter out occupied
                const available = allSlots.filter(slot => {
                    const slotTime = new Date(`${bookingDate}T${slot}`);

                    // Specific check for full day
                    if (occupied.some(occ => occ.fullDay)) return false;

                    // Check overlap
                    return !occupied.some(occ => {
                        if (!occ.startTime || !occ.endTime) return false;
                        const busyStart = new Date(occ.startTime);
                        const busyEnd = new Date(occ.endTime);

                        // If slot start is within a busy window
                        // (Strictly: BusyStart <= SlotStart < BusyEnd)
                        return (slotTime >= busyStart && slotTime < busyEnd);
                    });
                });

                setAvailableTimeSlots(available);
            } catch (err) {
                console.error("Error fetching occupied slots", err);
            }
        };

        fetchOccupiedSlots();
    }, [bookingDate, venueId]);

    const [paymentStep, setPaymentStep] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);

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
            const res = await api.post('/bookings', {
                venueId,
                date: bookingDate,
                guestCount: parseInt(guestCount),
                eventType,
                eventTime,
                duration,
                contact: { fullName, email, phone },
                notes: specialRequests,
                packageId: selectedPackageId
            });
            // Navigate to payment page with booking data
            navigate(`/payment/${res.data._id}`, {
                state: { booking: res.data }
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || "Booking failed. Please try again.");
        }
    };

    const handlePayment = async () => {
        try {
            await api.post(`/bookings/${currentBookingId}/pay`);
            addToast("Payment Successful! Booking Confirmed.", 'success');
            navigate('/bookings');
        } catch (err) {
            console.error(err);
            addToast("Payment failed. Please try again from My Bookings.", 'error');
            navigate('/bookings');
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
                                        min={new Date().toISOString().split('T')[0]}
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Event Time</label>
                                    <select
                                        required
                                        value={eventTime}
                                        onChange={(e) => setEventTime(e.target.value)}
                                        disabled={!bookingDate}
                                    >
                                        <option value="">Select Time</option>
                                        {availableTimeSlots.map((time) => {
                                            const [hours, minutes] = time.split(':');
                                            const h = parseInt(hours, 10);
                                            const ampm = h >= 12 ? 'PM' : 'AM';
                                            const h12 = h % 12 || 12;
                                            const formattedTime = `${h12}:${minutes} ${ampm}`;
                                            return (
                                                <option key={time} value={time}>
                                                    {formattedTime}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="form-group half">
                                    <label>Duration (Hours)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0.5"
                                        step="0.5"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}

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

                            {/* Packages Section */}
                            {venue.packages && venue.packages.length > 0 && (
                                <div className="packages-selection-wrapper" style={{ marginTop: '2rem' }}>
                                    <h3>Select Event Package (Optional)</h3>
                                    <div className="packages-selection-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '15px',
                                        marginTop: '15px'
                                    }}>
                                        {venue.packages.map((pkg) => (
                                            <div
                                                key={pkg._id}
                                                className={`package-select-card ${selectedPackageId === pkg._id ? 'selected' : ''}`}
                                                onClick={() => setSelectedPackageId(selectedPackageId === pkg._id ? '' : pkg._id)}
                                                style={{
                                                    border: selectedPackageId === pkg._id ? '2px solid #1a237e' : '1px solid #e2e8f0',
                                                    padding: '15px',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    background: selectedPackageId === pkg._id ? '#f0f4ff' : 'white'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    <strong style={{ fontSize: '1.1rem' }}>{pkg.name}</strong>
                                                    <input
                                                        type="radio"
                                                        checked={selectedPackageId === pkg._id}
                                                        onChange={() => { }} // Controlled by div click
                                                    />
                                                </div>
                                                <p style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981', margin: '5px 0' }}>+ Rs. {pkg.price.toLocaleString()}</p>
                                                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>{pkg.services?.join(' • ')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                        <div className="price-row">
                            <span>Package Price</span>
                            <span>Rs. {venue.packages?.find(p => p._id === selectedPackageId)?.price.toLocaleString() || 0}</span>
                        </div>
                        <hr />
                        <div className="price-row total">
                            <span>Total Amount</span>
                            <span>Rs. {((parseInt(guestCount) || 0) * (venue.pricePerGuest || 1200) + (venue.packages?.find(p => p._id === selectedPackageId)?.price || 0)).toLocaleString()}</span>
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

            {/* Payment Modal */}
            {
                paymentStep && (
                    <div className="modal-overlay">
                        <div className="modal payment-modal">
                            <h2>Confirm Payment</h2>
                            <div className="payment-details">
                                <p><strong>Venue:</strong> {venue.name}</p>
                                <p><strong>Amount:</strong> Rs. {(parseInt(guestCount) || 0) * (venue.pricePerGuest || 1200)}</p>
                                <div className="payment-methods">
                                    <label><input type="radio" name="method" defaultChecked /> Credit Card (Simulate)</label>
                                    <label><input type="radio" name="method" disabled /> UPI (Coming Soon)</label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => navigate('/bookings')}>Pay Later</button>
                                <button className="btn-primary" onClick={handlePayment}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default BookingPage;
