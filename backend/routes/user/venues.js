import express from 'express';
import Venue from '../../models/Venue.js';

const router = express.Router();

// Get All Venues with Filtering
router.get('/', async (req, res) => {
    try {
        const { search, capacity, type } = req.query;
        let query = {};

        // Search by name or location
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by capacity
        if (capacity && capacity !== 'All') {
            if (capacity === '500-1000 guests') {
                query.capacity = { $regex: '500|600|700|800|900|1000' };
            } else if (capacity === 'Under 500') {
                // Simplified capacity check for variety
                query.capacity = { $not: /1000|900|800|700|600|500/ };
            }
        }

        // Filter by event type
        if (type && type !== 'All') {
            query.eventTypes = { $in: [type] };
        }

        const venues = await Venue.find(query).populate('owner');
        res.json(venues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Featured Venues
router.get('/featured', async (req, res) => {
    try {
        const venues = await Venue.find().populate('owner');
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

export default router;
