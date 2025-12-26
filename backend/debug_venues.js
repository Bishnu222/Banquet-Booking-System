
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Venue from './models/Venue.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/banquet-booking')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const checkData = async () => {
    try {
        const venues = await Venue.find().populate('owner');
        console.log(`Total Venues: ${venues.length}`);

        venues.forEach(v => {
            const ownerName = v.owner ? v.owner.name : 'Unknown';
            const ownerRole = v.owner ? v.owner.role : 'N/A';
            const ownerId = v.owner ? v.owner._id : v.owner; // If populate failed, it might be the ID or null
            console.log(`Venue: ${v.name}, Owner: ${ownerName}, Role: ${ownerRole}, OwnerID: ${ownerId}`);
        });

        const admins = await User.find({ role: 'admin' });
        console.log(`\nTotal Admins: ${admins.length}`);
        admins.forEach(a => console.log(`Admin: ${a.name} (${a.email}) ID: ${a._id}`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

checkData();
