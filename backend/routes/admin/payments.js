import express from 'express';
import Payment from '../../models/Payment.js';
import Booking from '../../models/Booking.js';
import adminAuth from '../../middleware/admin/auth.js';

const router = express.Router();

/**
 * @route   GET /api/admin/payments
 * @desc    Get all payments
 * @access  Admin
 */
router.get('/', adminAuth, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('booking')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET /api/admin/payments/:id
 * @desc    Get payment by ID
 * @access  Admin
 */
router.get('/:id', adminAuth, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate({
                path: 'booking',
                populate: { path: 'venue' }
            })
            .populate('user', 'name email phone');

        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   PATCH /api/admin/payments/:id/status
 * @desc    Update payment status (Manual completion for Cash/Offline)
 * @access  Admin
 */
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        payment.paymentStatus = status;
        if (status === 'completed') {
            payment.completedAt = Date.now();
        }
        await payment.save();

        // If status is completed, update the associated booking as well
        if (status === 'completed') {
            await Booking.findByIdAndUpdate(payment.booking, {
                paymentStatus: 'paid',
                transactionId: payment.transactionId
            });
        }

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   POST /api/admin/payments/:id/refund
 * @desc    Handle refund (Manual process logging)
 * @access  Admin
 */
router.post('/:id/refund', adminAuth, async (req, res) => {
    try {
        const { reason, amount } = req.body;

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        if (payment.paymentStatus !== 'completed') {
            return res.status(400).json({ msg: 'Only completed payments can be refunded' });
        }

        payment.paymentStatus = 'refunded';
        payment.refundReason = reason;
        payment.refundAmount = amount || payment.amount;
        payment.refundedAt = Date.now();

        await payment.save();

        // Update booking status if necessary
        await Booking.findByIdAndUpdate(payment.booking, {
            paymentStatus: 'refunded'
        });

        res.json({ msg: 'Payment marked as refunded', payment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
