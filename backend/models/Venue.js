import mongoose from 'mongoose';

const VenueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: String, required: true },
    priceRange: { type: String, required: true },
    images: { type: [String], required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'ownerModel'
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['User', 'Owner'],
        default: 'Owner'
    },
    description: { type: String, required: true },
    pricePerGuest: { type: Number, default: 1200 },
    eventTypes: { type: [String], default: [] },
    packages: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        services: { type: [String], default: [] }
    }],
    amenities: { type: [String], default: [] },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    blockedDates: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Venue', VenueSchema);
