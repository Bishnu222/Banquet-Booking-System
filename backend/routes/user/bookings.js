import express from 'express';
import Booking from '../../models/Booking.js';
import Venue from '../../models/Venue.js';
import User from '../../models/user/User.js';
import userAuth from '../../middleware/user/auth.js';
import { sendBookingConfirmation, sendPaymentNotification } from '../../utils/emailService.js';
import Notification from '../../models/Notification.js';

const router = express.Router();

// Create Booking
router.post('/', userAuth, async (req, res) => {
    console.log('\n📝 New Booking Request received');
    console.log('   Body:', JSON.stringify(req.body));
    console.log('   User from Auth:', req.user ? req.user.id : 'UNDEFINED');
    try {
        const { venueId, date, guestCount, eventTime, duration, packageId, contact, eventType } = req.body;

        if (!date || !eventTime) {
            return res.status(400).json({ msg: 'Date and Event Time are required' });
        }

        // 1. Validate Date (Must be future or today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(date);
        const bookingDateOnly = new Date(date);
        bookingDateOnly.setHours(0, 0, 0, 0);

        if (bookingDateOnly < today) {
            return res.status(400).json({ msg: 'Bookings cannot be made for past dates' });
        }

        // 2. Calculate Start and End Time
        if (!duration) {
            return res.status(400).json({ msg: 'Duration is required' });
        }

        let durationHours = 0;
        const parsed = parseFloat(duration);
        if (!isNaN(parsed) && parsed > 0) {
            durationHours = parsed;
        } else {
            return res.status(400).json({ msg: 'Invalid duration' });
        }

        const [hours, minutes] = eventTime.split(':');
        if (minutes !== '00' && minutes !== '30') {
            return res.status(400).json({ msg: 'Bookings must start on the hour or half-hour (e.g. 8:00, 8:30)' });
        }

        const startDateTime = new Date(`${date}T${eventTime}`);
        const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000);

        if (isNaN(startDateTime.getTime())) {
            return res.status(400).json({ msg: 'Invalid Date or Time format' });
        }

        // 3. Check for Overlaps
        const potentialConflicts = await Booking.find({
            venue: venueId,
            status: { $ne: 'cancelled' },
            date: {
                $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
                $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
            }
        });

        const hasOverlap = potentialConflicts.some(b => {
            if (!b.startTime || !b.endTime) return true; // Block legacy full-day bookings
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

        // Check if date is blocked by owner
        if (venue.blockedDates && venue.blockedDates.includes(date)) {
            return res.status(400).json({ msg: 'This date has been blocked by the venue owner' });
        }

        const pricePerGuest = venue.pricePerGuest || 1200;
        let packagePrice = 0;
        let selectedPackage = null;

        if (packageId && venue.packages) {
            const pkg = venue.packages.id(packageId);
            if (pkg) {
                packagePrice = pkg.price;
                selectedPackage = { name: pkg.name, price: pkg.price };
            }
        }

        const totalPrice = (guestCount * pricePerGuest) + packagePrice;

        const booking = new Booking({
            user: req.user.id,
            venue: venueId,
            date: bookingDate,
            startTime: startDateTime,
            endTime: endDateTime,
            guestCount,
            totalPrice,
            selectedPackage,
            selectedPackage,
            contact,
            eventType
        });
        await booking.save();
        const newBooking = await Booking.findById(booking._id).populate('venue');
        console.log('   ✅ Booking saved:', newBooking._id);

        console.log('   📧 Attempting to fetch user for email confirmation...');
        const user = await User.findById(req.user.id);
        if (user) {
            console.log('   ✅ User found for email:', user.email);
            await sendBookingConfirmation(user, newBooking, venue);
        } else {
            console.log('   ⚠️ User not found for email dispatch');
        }

        // Create In-App Notification for Owner
        const ownerNotification = new Notification({
            recipient: venue.owner,
            recipientModel: venue.ownerModel || 'Owner',
            message: `New booking request received for ${venue.name} from ${req.user.name}.`,
            type: 'new_booking',
            relatedId: newBooking._id
        });
        await ownerNotification.save();

        res.json(newBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Booking
router.put('/:id', userAuth, async (req, res) => {
    try {
        const { date, guestCount } = req.body;
        let booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

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

// Simulate Payment
router.post('/:id/pay', userAuth, async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        if (booking.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to pay for this booking' });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ msg: 'Booking is already paid' });
        }

        await booking.save();

        // Send Payment Success Email
        const user = await User.findById(req.user.id);
        const venue = await Venue.findById(booking.venue);
        if (user && venue) {
            await sendPaymentNotification(user, booking, venue);
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User Bookings
router.get('/my', userAuth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('venue')
            .populate('user', 'name email phone');
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Booking (Cancel) - User logic
router.delete('/:id', userAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('venue'); // populate might not be needed for simple user check, but kept for consistency

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Check user (Creator)
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

// Get Occupied Slots (Public)
router.get('/occupied', async (req, res) => {
    try {
        const { venueId, date } = req.query;

        if (!venueId || !date) {
            return res.status(400).json({ msg: 'Venue ID and Date are required' });
        }

        const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

        const bookings = await Booking.find({
            venue: venueId,
            status: { $ne: 'cancelled' },
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        const occupiedSlots = bookings.map(b => {
            if (!b.startTime || !b.endTime) return { fullDay: true };
            return {
                startTime: b.startTime,
                endTime: b.endTime
            };
        });

        res.json(occupiedSlots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
