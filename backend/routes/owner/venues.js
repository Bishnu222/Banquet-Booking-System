import express from 'express';
import Venue from '../../models/Venue.js';
import ownerAuth from '../../middleware/owner/auth.js';
import multer from 'multer';

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// @route   GET /api/owner/venues
// @desc    Get all venues for the logged in owner
// @access  Private
router.get('/', ownerAuth, async (req, res) => {
    try {
        const venues = await Venue.find({ owner: req.user.id });
        res.json(venues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/owner/venues
// @desc    Create a venue (Owner version)
// @access  Private
router.post('/', ownerAuth, upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const venueData = {
            ...req.body,
            images: imagePaths.length > 0 ? imagePaths : (req.body.images || []),
            owner: req.user.id,
            ownerModel: 'Owner'
        };

        const newVenue = new Venue(venueData);
        const venue = await newVenue.save();
        res.json(venue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/owner/venues/:id
// @desc    Update a venue
// @access  Private
router.put('/:id', ownerAuth, upload.array('images', 5), async (req, res) => {
    try {
        let venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ msg: 'Venue not found' });

        if (venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        venue = await Venue.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.json(venue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/owner/venues/:id/block-dates
// @desc    Update blocked dates for a venue
// @access  Private
router.patch('/:id/block-dates', ownerAuth, async (req, res) => {
    try {
        const { blockedDates } = req.body;
        let venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ msg: 'Venue not found' });

        if (venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        venue.blockedDates = blockedDates;
        await venue.save();
        res.json(venue);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/owner/venues/:id
// @desc    Delete a venue
// @access  Private
router.delete('/:id', ownerAuth, async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ msg: 'Venue not found' });

        if (venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await venue.deleteOne();
        res.json({ msg: 'Venue removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
