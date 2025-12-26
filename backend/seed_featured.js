
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Venue from './models/Venue.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/banquet-booking');
        console.log('MongoDB Connected');

        // 1. Create/Get Admin User
        const email = 'admin@example.com';
        const password = 'admin123';
        let admin = await User.findOne({ email });

        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            admin = new User({
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user found');
            if (admin.role !== 'admin') {
                admin.role = 'admin';
                await admin.save();
                console.log('User role updated to admin');
            }
        }

        // 2. Clear venues owned by this admin to avoid duplicates
        await Venue.deleteMany({ owner: admin._id });

        // 3. Create Featured Venues
        const venues = [
            {
                name: "Grand Imperial Ballroom",
                location: "Durbar Marg, Kathmandu",
                capacity: "1000",
                priceRange: "2 Lakh - 5 Lakh",
                pricePerGuest: 1500,
                description: "The most luxurious ballroom in the city, perfect for royal weddings.",
                eventTypes: ["Wedding", "Corporate"],
                images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1080&q=80"],
                owner: admin._id
            },
            {
                name: "Lakeside Garden Venue",
                location: "Pokhara",
                capacity: "500",
                priceRange: "1 Lakh - 3 Lakh",
                pricePerGuest: 1200,
                description: "Beautiful outdoor venue with a stunning view of Phewa Lake.",
                eventTypes: ["Wedding", "Party"],
                images: ["https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?auto=format&fit=crop&w=1080&q=80"],
                owner: admin._id
            },
            {
                name: "Royal Heritage Hall",
                location: "Patan, Lalitpur",
                capacity: "800",
                priceRange: "1.5 Lakh - 4 Lakh",
                pricePerGuest: 1300,
                description: "Experience the tradition and culture in our heritage styled hall.",
                eventTypes: ["Wedding", "Cultural"],
                images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1080&q=80"],
                owner: admin._id
            }
        ];

        await Venue.insertMany(venues);
        console.log(`Created ${venues.length} featured venues owned by admin.`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
