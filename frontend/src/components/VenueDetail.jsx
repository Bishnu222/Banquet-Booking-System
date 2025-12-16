import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ImageWithFallback } from "../image/ImageWithFallback";
import './VenueDetail.css';

function VenueDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);



    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await api.get(`/venues/${id}`);
                setVenue(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching venue details:", err);
                setLoading(false);
            }
        };
        fetchVenue();
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000${imagePath}`;
    };

    const handleBookClick = () => {
        navigate(`/book/${id}`);
    };

    if (loading) return <div className="detail-loading">Loading...</div>;
    if (!venue) return <div className="detail-error">Venue not found</div>;

    return (
        <div className="venue-detail-container">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="back-btn-simple">
                &larr;
            </button>

            {/* 1. Image Grid Section */}
            <section className="venue-images-grid">
                <div className="main-image-frame">
                    <ImageWithFallback
                        src={getImageUrl(venue.images?.[0])}
                        alt={venue.name}
                        className="grid-main-img"
                    />
                </div>
                <div className="side-images-col">
                    {[1, 2, 3].map((offset) => (
                        <div key={offset} className="side-image-frame">
                            <ImageWithFallback
                                src={getImageUrl(venue.images?.[offset])}
                                alt={`Venue scan ${offset}`}
                                className="grid-side-img"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Content & Booking Section */}
            <div className="venue-content-wrapper">
                {/* Left Column: Details */}
                <div className="venue-left-details">
                    <h1 className="venue-title-large">{venue.name}</h1>
                    <div className="venue-location-row">
                        <span className="location-icon">📍</span>
                        <span>{venue.location}</span>
                    </div>

                    <p className="venue-description-text">
                        {venue.description}
                    </p>

                    {/* Info Bar (Capacity, Price, Address) */}
                    <div className="venue-info-bar">
                        <div className="info-bar-item">
                            <span className="info-icon">👥</span>
                            <div>
                                <span className="info-label">Capacity</span>
                                <span className="info-val">{venue.capacity} guests</span>
                            </div>
                        </div>
                        <div className="info-bar-item">
                            <span className="info-icon">💵</span>
                            <div>
                                <span className="info-label">Price Range</span>
                                <span className="info-val">{venue.priceRange}</span>
                            </div>
                        </div>
                        <div className="info-bar-item">
                            <span className="info-icon">📍</span>
                            <div>
                                <span className="info-label">Address</span>
                                <span className="info-val">{venue.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Card */}
                <div className="venue-booking-sidebar">
                    <div className="booking-card">
                        <h3>Book this venue</h3>
                        <p className="price-start">Starting from</p>
                        <h2 className="price-highlight">{venue.priceRange || 'Contact for Price'}</h2>

                        <button className="book-now-btn" onClick={handleBookClick}>
                            Book Now
                        </button>

                        <div className="availability-section">
                            <h4>Availability</h4>
                            <ul className="availability-list">
                                <li><span className="check-icon">✓</span> Available weekends</li>
                                <li><span className="check-icon">✓</span> December slots filling fast</li>
                                <li><span className="check-icon">✓</span> Advance booking recommended</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VenueDetail;
