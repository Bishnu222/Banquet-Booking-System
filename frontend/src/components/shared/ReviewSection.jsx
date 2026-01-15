import React, { useState, useEffect } from 'react';
import api from '../../api';
import './ReviewSection.css';

const ReviewSection = ({ venueId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/venue/${venueId}`);
                setReviews(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setLoading(false);
            }
        };
        fetchReviews();
    }, [venueId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('Please sign in to leave a review');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const res = await api.post('/reviews', {
                venueId,
                rating,
                comment
            });
            setReviews([res.data, ...reviews]);
            setComment('');
            setRating(5);
            setSubmitting(false);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error posting review');
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <h2 className="reviews-title">Customer Reviews ({reviews.length})</h2>
            </div>

            {token ? (
                <div className="review-form-card">
                    <h4>Leave a Review</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-btn ${rating >= star ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="comment-input"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                        <button
                            type="submit"
                            className="submit-review-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Posting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="review-form-card">
                    <p style={{ margin: 0 }}>Please <a href="/signin">sign in</a> to leave a review.</p>
                </div>
            )}

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="review-item">
                            <div className="review-meta">
                                <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="review-stars">
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
