import express from 'express';
import Review from '../../models/Review.js';
import Venue from '../../models/Venue.js';
import userAuth from '../../middleware/user/auth.js';

const router = express.Router();

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private (User only)
router.post('/', userAuth, async (req, res) => {
    try {
        const { venueId, rating, comment } = req.body;

        if (!venueId || !rating || !comment) {
            return res.status(400).json({ msg: 'Please provide venue ID, rating, and comment' });
        }

        // Check if venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) {
            return res.status(404).json({ msg: 'Venue not found' });
        }

        // Create review
        const review = new Review({
            user: req.user.id,
            venue: venueId,
            rating,
            comment
        });

        await review.save();

        // Update venue rating
        const reviews = await Review.find({ venue: venueId });
        venue.numReviews = reviews.length;
        venue.averageRating =
            reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await venue.save();

        const populatedReview = await Review.findById(review._id).populate('user', 'name');

        res.status(201).json(populatedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reviews/venue/:venueId
// @desc    Get reviews for a venue
// @access  Public
router.get('/venue/:venueId', async (req, res) => {
    try {
        const reviews = await Review.find({ venue: req.params.venueId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
