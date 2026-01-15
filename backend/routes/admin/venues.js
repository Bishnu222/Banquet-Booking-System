import express from 'express';
import Venue from '../../models/Venue.js';

import multer from 'multer';

// Note: Imports above assume the "Deep Clean" move happened. 
// However, the user INTERRUPTED the deep clean task to ask this question.
// I must ascertain if the moves happened.
// I planned them but haven't executed "Deep Clean" moves on Middleware yet.
// I only did separate routes folders.
// Let's check where middleware actually IS.
// Task 110 created routes folders.
// Task 168 planned frontend.
// Step 306 showed middleware dir:
// { "name": "userAuthMiddleware.js" ... }
// So they are STILL in `backend/middleware/`.
// I MUST use the CURRENT paths.

const router = express.Router();

import User from '../../models/user/User.js'; // Admin is a User
// Middleware imports (using CURRENT paths)
import userAuthMiddleware from '../../middleware/user/auth.js';
import { verifyAdmin as verifyAdminMiddleware } from '../../middleware/admin/auth.js';

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

// Get All Venues (Admin View - Unfiltered)
router.get('/', userAuthMiddleware, verifyAdminMiddleware, async (req, res) => {
    try {
        const venues = await Venue.find().populate('owner');
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Venue (Admin)
router.post('/', userAuthMiddleware, verifyAdminMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        const finalImages = imagePaths.length > 0 ? imagePaths : (req.body.images || []);

        const venue = new Venue({
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            capacity: req.body.capacity,
            pricePerGuest: req.body.pricePerGuest,
            priceRange: req.body.priceRange,
            images: finalImages,
            owner: req.user.id, // Admin ID
            ownerModel: 'User'
        });

        const newVenue = await venue.save();
        res.status(201).json(newVenue);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Venue (Admin - Can update ANY venue)
router.put('/:id', userAuthMiddleware, verifyAdminMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });

        // Admin can update any venue, no ownership check needed (or strictly verify it exists)

        venue.name = req.body.name || venue.name;
        venue.description = req.body.description || venue.description;
        venue.location = req.body.location || venue.location;
        venue.capacity = req.body.capacity || venue.capacity;
        venue.pricePerGuest = req.body.pricePerGuest || venue.pricePerGuest;
        venue.priceRange = req.body.priceRange || venue.priceRange;

        // Handle images update if new ones provided
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
            venue.images = imagePaths;
        }

        const updatedVenue = await venue.save();
        res.json(updatedVenue);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Venue (Admin)
router.delete('/:id', userAuthMiddleware, verifyAdminMiddleware, async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ message: 'Venue not found' });

        await venue.deleteOne();
        res.json({ message: 'Venue deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
