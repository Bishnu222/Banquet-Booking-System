import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please check your .env file');
    process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
    console.warn('Warning: JWT_SECRET should be at least 32 characters for security');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        console.error('Please ensure MongoDB is running and MONGO_URI is correct');
        process.exit(1);
    });

// Routes
import userAuthRoutes from './routes/user/auth.js';

import userVenueRoutes from './routes/user/venues.js';
import ownerVenueRoutes from './routes/owner/venues.js';

import userBookingRoutes from './routes/user/bookings.js';
import ownerBookingRoutes from './routes/owner/bookings.js';
import userPaymentRoutes from './routes/user/payments.js';
import ownerAuthRoutes from './routes/owner/auth.js';
import ownerReviewRoutes from './routes/owner/reviews.js';

import adminUserRoutes from './routes/admin/users.js';
import notificationRoutes from './routes/notifications.js';

// Auth
app.use('/api/auth/user', userAuthRoutes);
app.use('/api/auth/owner', ownerAuthRoutes);

// Venues
// Public/User - Read Only
app.use('/api/venues', userVenueRoutes);
app.use('/api/owner/venues', ownerVenueRoutes);

// Bookings

// User Bookings
app.use('/api/bookings', userBookingRoutes);
app.use('/api/owner/bookings', ownerBookingRoutes);
app.use('/api/owner/reviews', ownerReviewRoutes);

// Payments
app.use('/api/payments', userPaymentRoutes);

// Notifications
app.use('/api/notifications', notificationRoutes);

// Admin
import adminVenueRoutes from './routes/admin/venues.js';
import adminPaymentRoutes from './routes/admin/payments.js';
import reviewsRoutes from './routes/user/reviews.js';
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin/venues', adminVenueRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);
app.use('/api/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
