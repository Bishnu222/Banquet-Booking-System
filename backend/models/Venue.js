import mongoose from 'mongoose';

const VenueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: String, required: true },
    priceRange: { type: String, required: true },
    images: { type: [String], required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    pricePerGuest: { type: Number, default: 1200 },
    eventTypes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Venue', VenueSchema);
