import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);
import venueRoutes from './routes/venues.js';
app.use('/api/venues', venueRoutes);
import bookingRoutes from './routes/bookings.js';
app.use('/api/bookings', bookingRoutes);
import adminRoutes from './routes/admin.js';
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
