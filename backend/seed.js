import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Venue from './models/Venue.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const venues = [
    {
        name: "Royal Place Banquets",
        location: "Kathmandu Nepal",
        capacity: "500-1000 guests",
        priceRange: "NPR 150,000 - 300,000",
        image: "https://royalpalacenepal.com/wp-content/uploads/2024/02/Royal-Palace-Banquet-in-Gokarna-Mulpani-Kathmandu-768x512.jpg",
        description: "Perfect for grand celebrations and weddings with luxurious interiors and world-class service.",
        eventTypes: ["Wedding"],
    },
    {
        name: "Silver Oak",
        location: "Kathmandu Nepal",
        capacity: "500-1000 guests",
        priceRange: "NPR 150,000 - 300,000",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU59haWJUAhUwr2cYyojB0jlr8faYbZqVSJg&s",
        description: "Elegant space for intimate gatherings with personalized service and attention to detail.",
        eventTypes: ["Wedding"],
    },
    {
        name: "Taaj",
        location: "Kathmandu, Nepal",
        capacity: "500-1000 guests",
        priceRange: "NPR 150,000 - 300,000",
        image: "https://taajpalace.com/wp-content/uploads/2022/04/Best-banquet-in-kathmandu-1.jpg",
        description: "Luxury venue with premium amenities and elegant décor, ideal for sophisticated events.",
        eventTypes: ["Wedding"],
    },
    {
        name: "Imperial Banquet",
        location: "Kathmandu Nepal",
        capacity: "500-1000 guests",
        priceRange: "NPR 150,000 - 300,000",
        image: "https://imperialbanquetnepal.com/wp-content/uploads/2019/12/Impereial_Banquet_Terrace_Reception.jpg",
        description: "Sophisticated venue for events with modern facilities",
        eventTypes: ["Wedding"],
    }
];

const seedDB = async () => {
    try {
        await Venue.deleteMany({});
        await Venue.insertMany(venues);
        console.log('Venues Seeded');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedDB();
