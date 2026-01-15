import express from 'express';
import Booking from '../../models/Booking.js';
import Venue from '../../models/Venue.js';
import Notification from '../../models/Notification.js';
import ownerAuth from '../../middleware/owner/auth.js';

const router = express.Router();

// @route   GET /api/owner/bookings
// @desc    Get all bookings for venues owned by the owner
// @access  Private
router.get('/', ownerAuth, async (req, res) => {
    try {
        const venues = await Venue.find({ owner: req.user.id });
        const venueIds = venues.map(v => v._id);

        const bookings = await Booking.find({ venue: { $in: venueIds } })
            .populate('venue')
            .populate('user', 'name email phone')
            .sort({ date: -1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/owner/bookings/:id/status
// @desc    Update booking status (confirm/cancel)
// @access  Private
router.patch('/:id/status', ownerAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('venue');

        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        if (booking.venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        booking.status = status;
        await booking.save();

        // Create notification for the user
        const statusMessage = status === 'confirmed'
            ? `Your booking for ${booking.venue.name} has been confirmed!`
            : `Your booking for ${booking.venue.name} has been cancelled.`;

        const userNotification = new Notification({
            recipient: booking.user,
            recipientModel: 'User',
            message: statusMessage,
            type: 'booking_status',
            relatedId: booking._id
        });
        await userNotification.save();

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
