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
        const { venueId, date, guestCount, eventTime, duration } = req.body;

        if (!date || !eventTime) {
            return res.status(400).json({ msg: 'Date and Event Time are required' });
        }

        // 1. Validate Date (Must be future or today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(date);

        // Fix timezone offset issue by just comparing year/month/day parts or ensuring UTC integrity, 
        // but for simplicity in this local app:
        const bookingDateOnly = new Date(date);
        bookingDateOnly.setHours(0, 0, 0, 0);

        if (bookingDateOnly < today) {
            return res.status(400).json({ msg: 'Bookings cannot be made for past dates' });
        }

        // 2. Calculate Start and End Time
        // Parse duration (e.g. "5 hours" or "5")
        let durationHours = 4; // Default
        if (duration) {
            const parsed = parseInt(duration);
            if (!isNaN(parsed) && parsed > 0) {
                durationHours = parsed;
            }
        }

        // Combine date and time strings
        const startDateTime = new Date(`${date}T${eventTime}`);
        const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000);

        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({ msg: 'Invalid Date or Time format' });
        }

        // 3. Check for Overlaps
        // Find bookings for this venue where:
        // (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
        // And status is not cancelled
        // 3. Check for Overlaps
        // Find bookings for this venue where:
        // A) Logic for new bookings with time: (NewStart < ExistingEnd) AND (NewEnd > ExistingStart)
        // B) Logic for legacy bookings (date only): Date matches AND existing.startTime doesn't exist (assume full day block)

        const conflictingBooking = await Booking.findOne({
            venue: venueId,
            status: { $ne: 'cancelled' },
            $or: [
                // Overlap with time-based bookings
                {
                    startTime: { $exists: true }, // Ensure it has time
                    startTime: { $lt: endDateTime },
                    endTime: { $gt: startDateTime }
                },
                // Overlap with legacy date-only bookings (block the whole day)
                {
                    startTime: { $exists: false },
                    date: {
                        $gte: new Date(date + 'T00:00:00.000Z'),
                        $lt: new Date(date + 'T23:59:59.999Z')
                    }
                    // Note: Date comparison depends on how 'date' was stored. 
                    // Assuming 'date' stored as Date object at midnight or some time.
                    // Doing a simplified check for now assuming 'date' match:
                }
            ]
        });

        // Refined Legacy Check manually to avoid timezone complex mongo queries if needed, 
        // but let's try a simpler date match if the above is too complex.
        // Actually, let's keep it simple: matches existing date?
        // But store 'date' is a Date object.
        // Let's rely on the previous simple check for time, and ADD a check for legacy.

        const legacyConflict = await Booking.findOne({
            venue: venueId,
            status: { $ne: 'cancelled' },
            startTime: { $exists: false },
            // Check if dates fall on same day. 
            // This is hard with exact Date match. 
            // Let's assume legacy bookings are effectively blocking. 
        });

        // Simpler approach: Fetch possible conflicts by date range (broad), then filter in JS
        const potentialConflicts = await Booking.find({
            venue: venueId,
            status: { $ne: 'cancelled' },
            date: {
                $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
            }
        });

        const hasOverlap = potentialConflicts.some(b => {
            // If legacy (no start/end), it blocks everything on that day
            if (!b.startTime || !b.endTime) return true;

            // If new (has start/end), check time overlap
            const existStart = new Date(b.startTime).getTime();
            const existEnd = new Date(b.endTime).getTime();
            const newStart = startDateTime.getTime();
            const newEnd = endDateTime.getTime();

            return (newStart < existEnd && newEnd > existStart);
        });

        if (hasOverlap) {
            return res.status(400).json({ msg: 'Venue has been booked already' });
        }

        // 4. Calculate Total Price
        const venue = await Venue.findById(venueId);
        if (!venue) return res.status(404).json({ msg: 'Venue not found' });

        const pricePerGuest = venue.pricePerGuest || 1200;
        const totalPrice = guestCount * pricePerGuest;

        const booking = new Booking({
            user: req.user.id,
            venue: venueId,
            date: bookingDate, // Keep expected date part
            startTime: startDateTime,
            endTime: endDateTime,
            guestCount,
            totalPrice
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
