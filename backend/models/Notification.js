import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'recipientModel'
    },
    recipientModel: {
        type: String,
        required: true,
        enum: ['User', 'Owner'],
        default: 'User'
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['booking_status', 'new_booking', 'payment', 'announcement'],
        default: 'booking_status'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for performance
NotificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
