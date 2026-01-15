import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'owner',
        immutable: true
    },
    businessName: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const Owner = mongoose.model('Owner', OwnerSchema);
export default Owner;
