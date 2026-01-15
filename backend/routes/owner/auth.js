import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Owner from '../../models/owner/Owner.js';
import ownerAuth from '../../middleware/owner/auth.js';

const router = express.Router();

// @route   POST /api/auth/owner/signup
// @desc    Register owner
// @access  Public
router.post('/signup', async (req, res) => {
    const { name, email, password, businessName, phone, location } = req.body;

    try {
        // Validation
        if (!email || !email.includes('@')) {
            return res.status(400).json({ msg: 'Please provide a valid email address' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
        }

        let owner = await Owner.findOne({ email });
        if (owner) {
            return res.status(400).json({ msg: 'Owner already exists' });
        }

        owner = new Owner({
            name: name || businessName,
            email,
            password,
            businessName,
            phone,
            location
        });

        const salt = await bcrypt.genSalt(10);
        owner.password = await bcrypt.hash(password, salt);

        await owner.save();

        const payload = {
            user: {
                id: owner.id,
                role: 'owner'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: owner.id, name: owner.name, email: owner.email, role: 'owner' } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/owner/login
// @desc    Authenticate owner & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: owner.id,
                role: 'owner'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: owner.id, name: owner.name, email: owner.email, role: 'owner' } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/auth/owner/me
// @desc    Get current owner details
// @access  Private
router.get('/me', ownerAuth, async (req, res) => {
    try {
        const owner = await Owner.findById(req.user.id).select('-password');
        res.json(owner);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/auth/owner/update
// @desc    Update owner profile
// @access  Private
router.put('/update', ownerAuth, async (req, res) => {
    const { name, businessName, phone, location } = req.body;

    // Build update object
    const ownerFields = {};
    if (name) ownerFields.name = name;
    if (businessName) ownerFields.businessName = businessName;
    if (phone) ownerFields.phone = phone;
    if (location) ownerFields.location = location;

    try {
        let owner = await Owner.findById(req.user.id);
        if (!owner) return res.status(404).json({ msg: 'Owner not found' });

        owner = await Owner.findByIdAndUpdate(
            req.user.id,
            { $set: ownerFields },
            { new: true }
        ).select('-password');

        res.json(owner);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
