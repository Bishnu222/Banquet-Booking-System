import express from 'express';
import User from '../../models/user/User.js';
import userAuth from '../../middleware/user/auth.js';
import { verifyAdmin } from '../../middleware/admin/auth.js';

const router = express.Router();

// Get All Users (Admin only)
router.get('/users', userAuth, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete User (Admin only)
router.delete('/users/:id', userAuth, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.deleteOne();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
