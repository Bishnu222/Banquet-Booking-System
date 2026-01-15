import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB...');

        const email = 'admin@gmail.com';
        const password = 'admin123';
        const name = 'Admin';

        // Check if admin already exists
        let admin = await User.findOne({ email });
        if (admin) {
            console.log('⚠️ Admin account already exists. Updating password...');
        } else {
            admin = new User({
                name,
                email,
                role: 'admin'
            });
            console.log('🆕 Creating new Admin account...');
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();
        console.log('✅ Admin account seeded successfully!');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);

        process.exit();
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
