import express from 'express';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Create Booking
router.post('/', auth, async (req, res) => {
    try {
        const { venueId, date, guestCount } = req.body;
        const booking = new Booking({
            user: req.user.id,
            venue: venueId,
            date,
            guestCount
        });
        const newBooking = await booking.save();
        res.json(newBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Booking
router.put('/:id', auth, async (req, res) => {
    try {
        const { date, guestCount } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Check user
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        if (date) booking.date = date;
        if (guestCount) booking.guestCount = guestCount;

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Booking Status (Owner only)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        // 1. Find booking
        let booking = await Booking.findById(req.params.id).populate('venue');
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // 2. Check if current user is the owner of the venue
        // booking.venue is populated, so we check booking.venue.owner
        if (booking.venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to manage this booking' });
        }

        // 3. Update status
        if (status) booking.status = status;

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Owner Bookings
router.get('/owner', auth, async (req, res) => {
    try {
        // 1. Find venues owned by this user
        const venues = await Venue.find({ owner: req.user.id });
        const venueIds = venues.map(v => v._id);

        // 2. Find bookings for these venues
        const bookings = await Booking.find({ venue: { $in: venueIds } })
            .populate('venue')
            .populate('user', '-password'); // details of user who booked

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User Bookings
router.get('/my', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('venue');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Booking (Cancel)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Check user
        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await booking.deleteOne();

        res.json({ msg: 'Booking removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Booking not found' });
        }
        res.status(500).send('Server Error');
    }
});

export default router;
