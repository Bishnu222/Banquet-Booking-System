import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user/User.js';

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@gmail.com' });

        if (admin) {
            console.log('✅ Admin account found:');
            console.log('   Name:', admin.name);
            console.log('   Email:', admin.email);
            console.log('   Role:', admin.role);
            console.log('   Has Password:', !!admin.password);
        } else {
            console.log('❌ Admin account NOT found');
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkAdmin();
