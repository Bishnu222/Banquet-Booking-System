import express from 'express';
import Review from '../../models/Review.js';
import Venue from '../../models/Venue.js';
import ownerAuth from '../../middleware/owner/auth.js';

const router = express.Router();

// @route   GET /api/owner/reviews
// @desc    Get all reviews for venues owned by the owner
// @access  Private
router.get('/', ownerAuth, async (req, res) => {
    try {
        const venues = await Venue.find({ owner: req.user.id }).select('_id');
        const venueIds = venues.map(v => v._id);

        const reviews = await Review.find({ venue: { $in: venueIds } })
            .populate('user', 'name')
            .populate('venue', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/owner/reviews/:id/respond
// @desc    Respond to a review
// @access  Private
router.patch('/:id/respond', ownerAuth, async (req, res) => {
    try {
        const { response } = req.body;
        let review = await Review.findById(req.params.id).populate('venue');

        if (!review) return res.status(404).json({ msg: 'Review not found' });

        // Check if the owner owns the venue for this review
        if (review.venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        review.ownerResponse = response;
        review.respondedAt = Date.now();

        await review.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
