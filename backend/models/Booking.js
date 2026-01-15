import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    contact: {
        fullName: String,
        email: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date
    },
    eventType: {
        type: String,
        default: 'Wedding'
    },
    endTime: {
        type: Date
    },
    guestCount: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    selectedPackage: {
        name: String,
        price: Number
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Booking', BookingSchema);
