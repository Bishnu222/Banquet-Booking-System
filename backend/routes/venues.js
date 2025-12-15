import express from 'express';
import Venue from '../models/Venue.js';
import { auth, verifyOwner } from '../middleware/authMiddleware.js';

import multer from 'multer';
import path from 'path';

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

// Get All Venues
router.get('/', async (req, res) => {
    try {
        const venues = await Venue.find();
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Venues for Logged in Owner
router.get('/my-venues', auth, verifyOwner, async (req, res) => {
    try {
        const venues = await Venue.find({ owner: req.user.id });
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Venue
router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });
        res.json(venue);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Venue (Protected: Owner/Admin)
router.post('/', auth, verifyOwner, upload.array('images', 5), async (req, res) => {
    // req.files contains the uploaded files
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    // If no files uploaded, fallback to body.images if present (not common with FormData but safe)
    const finalImages = imagePaths.length > 0 ? imagePaths : (req.body.images || []);

    const venue = new Venue({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        capacity: req.body.capacity,
        priceRange: req.body.priceRange,
        images: finalImages,
        owner: req.user.id
    });

    try {
        const newVenue = await venue.save();
        res.status(201).json(newVenue);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Venue (Protected: Owner of that venue)
router.put('/:id', auth, verifyOwner, async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });

        // Check ownership
        if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this venue' });
        }

        venue.name = req.body.name || venue.name;
        venue.description = req.body.description || venue.description;
        venue.location = req.body.location || venue.location;
        venue.capacity = req.body.capacity || venue.capacity;
        venue.priceRange = req.body.priceRange || venue.priceRange;
        venue.images = req.body.images || venue.images;

        const updatedVenue = await venue.save();
        res.json(updatedVenue);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Venue (Protected: Owner of that venue)
router.delete('/:id', auth, verifyOwner, async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });

        // Check ownership
        if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this venue' });
        }

        await venue.deleteOne();
        res.json({ message: 'Venue deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
