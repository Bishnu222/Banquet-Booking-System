import express from 'express';
import Payment from '../../models/Payment.js';
import Booking from '../../models/Booking.js';
import userAuth from '../../middleware/user/auth.js';
import { EsewaPayment, KhaltiPayment, CardPayment } from '../../utils/paymentGateway.js';
import { sendPaymentNotification } from '../../utils/emailService.js';
import User from '../../models/user/User.js';

const router = express.Router();

// Initialize payment gateways
const esewaGateway = new EsewaPayment();
const khaltiGateway = new KhaltiPayment();
const cardGateway = new CardPayment();

// Initiate Payment
router.post('/initiate', userAuth, async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body;

        console.log('\n💳 [PAYMENT INITIATE]');
        console.log('   User:', req.user.email);
        console.log('   Booking ID:', bookingId);
        console.log('   Payment Method:', paymentMethod);

        // Get booking details
        const booking = await Booking.findById(bookingId).populate('venue');
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Verify booking belongs to user
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        // Check if payment already exists
        let payment = await Payment.findOne({ booking: bookingId, paymentStatus: 'completed' });
        if (payment) {
            return res.status(400).json({ msg: 'Payment already completed for this booking' });
        }

        // Create payment record
        payment = new Payment({
            booking: bookingId,
            user: req.user.id,
            amount: booking.totalPrice,
            paymentMethod: paymentMethod
        });

        await payment.save();

        // Generate payment gateway data based on method
        let paymentData = {};

        switch (paymentMethod) {
            case 'esewa':
                paymentData = esewaGateway.initiatePayment({
                    amount: booking.totalPrice,
                    transactionId: payment.transactionId
                });
                break;

            case 'khalti':
                paymentData = khaltiGateway.initiatePayment({
                    amount: booking.totalPrice,
                    transactionId: payment.transactionId,
                    productName: `Booking for ${booking.venue.name}`
                });
                break;

            case 'card':
                // Card payment handled in frontend
                paymentData = {
                    transactionId: payment.transactionId,
                    amount: booking.totalPrice
                };
                break;

            case 'cash':
                // Cash payment - mark as pending
                paymentData = {
                    transactionId: payment.transactionId,
                    message: 'Please pay cash at the venue'
                };
                break;

            case 'esewa_manual':
            case 'khalti_manual':
                // Manual payment reporting
                paymentData = {
                    transactionId: payment.transactionId,
                    message: 'Please complete the transfer manually and verify.'
                };
                break;

            default:
                return res.status(400).json({ msg: 'Invalid payment method' });
        }

        console.log('   ✅ Payment initiated:', payment.transactionId);

        res.json({
            payment: payment,
            gatewayData: paymentData
        });

    } catch (err) {
        console.error('   ❌ Payment initiation error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Process Card Payment
router.post('/card/process', userAuth, async (req, res) => {
    try {
        const { transactionId, cardDetails } = req.body;

        console.log('\n💳 [CARD PAYMENT]');
        console.log('   Transaction ID:', transactionId);

        // Find payment
        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        // Verify user
        if (payment.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        // Process card payment
        const result = await cardGateway.processPayment(cardDetails, payment.amount);

        if (result.success) {
            // Update payment
            payment.paymentStatus = 'completed';
            payment.completedAt = new Date();
            payment.gatewayTransactionId = result.transactionId;
            payment.cardDetails = {
                last4Digits: result.last4Digits,
                cardType: result.cardType,
                cardHolderName: cardDetails.cardHolderName
            };
            payment.gatewayResponse = result;
            await payment.save();

            // Update booking
            const updatedBooking = await Booking.findByIdAndUpdate(payment.booking, {
                paymentStatus: 'paid',
                transactionId: payment.transactionId
            }, { new: true }).populate('venue');

            // Send notification
            const userData = await User.findById(payment.user);
            if (userData && updatedBooking && updatedBooking.venue) {
                await sendPaymentNotification(userData, updatedBooking, updatedBooking.venue, payment);
            }

            console.log('   ✅ Card payment successful');

            res.json({
                success: true,
                message: 'Payment successful',
                payment: payment
            });
        } else {
            payment.paymentStatus = 'failed';
            payment.gatewayResponse = result;
            await payment.save();

            console.log('   ❌ Card payment failed:', result.message);

            res.status(400).json({
                success: false,
                message: result.message
            });
        }

    } catch (err) {
        console.error('   ❌ Card payment error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Verify eSewa Payment
router.post('/esewa/verify', userAuth, async (req, res) => {
    try {
        const { oid, amt, refId } = req.body;

        console.log('\n✅ [ESEWA VERIFY]');
        console.log('   Order ID:', oid);
        console.log('   Reference ID:', refId);

        // Verify with eSewa
        const result = await esewaGateway.verifyPayment({ oid, amt, refId });

        if (result.success) {
            // Find payment by transaction ID
            const payment = await Payment.findOne({ transactionId: oid });
            if (!payment) {
                return res.status(404).json({ msg: 'Payment not found' });
            }

            // Update payment
            payment.paymentStatus = 'completed';
            payment.completedAt = new Date();
            payment.gatewayTransactionId = refId;
            payment.gatewayResponse = result;
            await payment.save();

            // Update booking
            const updatedBooking = await Booking.findByIdAndUpdate(payment.booking, {
                paymentStatus: 'paid',
                transactionId: payment.transactionId
            }, { new: true }).populate('venue');

            // Send notification
            const userData = await User.findById(payment.user);
            if (userData && updatedBooking && updatedBooking.venue) {
                await sendPaymentNotification(userData, updatedBooking, updatedBooking.venue, payment);
            }

            console.log('   ✅ eSewa payment verified');

            res.json({
                success: true,
                message: 'Payment verified successfully',
                payment: payment
            });
        } else {
            console.log('   ❌ eSewa verification failed');
            res.status(400).json({ success: false, message: result.message });
        }

    } catch (err) {
        console.error('   ❌ eSewa verification error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Verify Khalti Payment
router.post('/khalti/verify', userAuth, async (req, res) => {
    try {
        const { token, amount, transactionId } = req.body;

        console.log('\n✅ [KHALTI VERIFY]');
        console.log('   Transaction ID:', transactionId);

        // Verify with Khalti
        const result = await khaltiGateway.verifyPayment(token, amount);

        if (result.success) {
            // Find payment
            const payment = await Payment.findOne({ transactionId });
            if (!payment) {
                return res.status(404).json({ msg: 'Payment not found' });
            }

            // Update payment
            payment.paymentStatus = 'completed';
            payment.completedAt = new Date();
            payment.gatewayTransactionId = result.transactionId;
            payment.gatewayResponse = result.data;
            await payment.save();

            // Update booking
            const updatedBooking = await Booking.findByIdAndUpdate(payment.booking, {
                paymentStatus: 'paid',
                transactionId: payment.transactionId
            }, { new: true }).populate('venue');

            // Send notification
            const userData = await User.findById(payment.user);
            if (userData && updatedBooking && updatedBooking.venue) {
                await sendPaymentNotification(userData, updatedBooking, updatedBooking.venue, payment);
            }

            console.log('   ✅ Khalti payment verified');

            res.json({
                success: true,
                message: 'Payment verified successfully',
                payment: payment
            });
        } else {
            console.log('   ❌ Khalti verification failed');
            res.status(400).json({ success: false, message: result.message });
        }

    } catch (err) {
        console.error('   ❌ Khalti verification error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get Payment Details
router.get('/:transactionId', userAuth, async (req, res) => {
    try {
        const payment = await Payment.findOne({ transactionId: req.params.transactionId })
            .populate('booking')
            .populate('user', '-password');

        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        // Verify user access
        if (payment.user._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        res.json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get User's Payment History
router.get('/history/my', userAuth, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate('booking')
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Report Manual Payment (eSewa/Khalti Manual Transfer)
router.post('/manual-report', userAuth, async (req, res) => {
    try {
        const { bookingId, paymentMethod, senderId, transactionCode, amount, remarks } = req.body;

        console.log('\n📝 [MANUAL PAYMENT REPORT]');
        console.log('   User:', req.user.email);
        console.log('   Booking ID:', bookingId);
        console.log('   Method:', paymentMethod);

        // Find/Create Payment Record
        // We might need to find an existing initiated payment or create a new one
        let payment = await Payment.findOne({ booking: bookingId, paymentStatus: { $ne: 'completed' } });

        if (!payment) {
            // Create new if not exists (though initiate likely called before)
            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ msg: 'Booking not found' });

            payment = new Payment({
                booking: bookingId,
                user: req.user.id,
                amount: amount || booking.totalPrice, // Use submitted amount
                paymentMethod: paymentMethod,
                transactionId: `MAN-${Date.now()}`
            });
        }

        // Update payment with manual details
        payment.amount = amount; // Ensure amount is updated to what user reported
        payment.paymentMethod = paymentMethod; // e.g., 'esewa_manual'
        payment.paymentStatus = 'pending'; // Pending verification
        payment.gatewayTransactionId = transactionCode; // Codes sent by user
        payment.manualDetails = {
            senderId,
            transactionCode,
            remarks,
            reportedAt: new Date()
        };

        await payment.save();

        res.json({ success: true, message: 'Payment reported successfully. Admin will verify.', payment });

    } catch (err) {
        console.error('   ❌ Manual report error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

export default router;
