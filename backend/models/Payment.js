import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'esewa', 'khalti', 'cash', 'esewa_manual', 'khalti_manual'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },
    // Manual Payment Details
    manualDetails: {
        senderId: String,
        transactionCode: String,
        remarks: String,
        reportedAt: Date
    },
    // Card Payment Details (if applicable)
    cardDetails: {
        last4Digits: String,
        cardType: String, // visa, mastercard, etc.
        cardHolderName: String
    },
    // Gateway Response
    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Payment Gateway Transaction ID
    gatewayTransactionId: String,

    // Refund Information
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    refundedAt: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

// Generate unique transaction ID
PaymentSchema.pre('save', function (next) {
    if (!this.transactionId) {
        this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

export default mongoose.model('Payment', PaymentSchema);
