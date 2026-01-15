import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user/User.js';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, role, phone, businessName, location } = req.body;

    try {
        // Validation
        if (!email || !email.includes('@')) {
            return res.status(400).json({ msg: 'Please provide a valid email address' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Role validation (Hardened: only allow 'user' via public registration)
        const assignedRole = 'user';

        user = new User({
            name,
            email,
            password,
            role: assignedRole
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role // Include role in JWT payload for security
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role // Include role in JWT payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Profile
import userAuth from '../../middleware/user/auth.js';
router.put('/update-profile', userAuth, async (req, res) => {
    const { name, password } = req.body;
    const userId = req.user.id;

    console.log('\n✏️ [USER UPDATE] PUT /auth/user/update-profile');
    console.log('   User ID:', userId);
    console.log('   Current name:', req.user.name);
    console.log('   New name:', name);
    console.log('   Password change:', !!password);

    try {
        let user = await User.findById(userId);
        if (!user) {
            console.log('   ❌ User not found in User collection');
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log('   Found user in User collection:', user.email);
        if (name) user.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        console.log('   ✅ User profile updated successfully');

        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error('   ❌ Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Get Current User Profile
router.get('/me', userAuth, async (req, res) => {
    try {
        console.log('\n📋 [USER PROFILE] GET /auth/user/me');
        console.log('   Requested by User ID:', req.user.id);
        console.log('   User Role:', req.user.role);
        console.log('   User Email:', req.user.email);

        const user = await User.findById(req.user.id).select('-password');
        console.log('   ✅ Found user:', user.name);
        res.json(user);
    } catch (err) {
        console.error('   ❌ Error:', err.message);
        res.status(500).send('Server Error');
    }
});

import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../utils/emailService.js';

// @route    POST api/auth/user/forgot-password
// @desc     Forgot password - send reset email
// @access   Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'No user with that email found' });
        }

        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `http://localhost:8080/reset-password/${token}?type=user`;
        await sendPasswordResetEmail(user.email, user.name, resetUrl);

        res.json({ msg: 'Password reset link sent to email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/auth/user/reset-password/:token
// @desc     Reset password
// @access   Public
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired reset token' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ msg: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
