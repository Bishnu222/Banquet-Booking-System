import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name email role');
        console.log('\n--- Registered Users ---');
        if (users.length === 0) {
            console.log('No users found in database.');
        } else {
            users.forEach(u => {
                console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
            });
        }
        console.log('------------------------\n');

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
