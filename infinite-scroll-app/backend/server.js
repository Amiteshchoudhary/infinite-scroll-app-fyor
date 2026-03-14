// Server - Express backend for infinite scroll activity app

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// In production, use environment variable: process.env.MONGODB_URI
// For local development, you can set a .env file or use default
// Example: mongodb://localhost:27017/infinite-scroll-app

async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infinite-scroll-app';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Continue without DB for demo purposes or handle as needed
  }
}

// Routes
app.use('/api', feedRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Seed endpoint (for development/testing)
app.post('/api/seed', async (req, res) => {
  try {
    const Activity = require('./models/Activity');
    const { generateActivities } = require('./seeds/seedData');
    
    // Clear existing data and seed new data
    await Activity.deleteMany({});
    
const activitiesData = generateActivities(100);
    
   // Use insertMany with ordered: false for bulk insert 
   await Activity.insertMany(activitiesData, { ordered: false });
   
   res.json({ message: 'Database seeded successfully', count: activitiesData.length });
 } catch (error) {
   console.error('Seed error:', error);
   res.status(500).json({ error: 'Failed to seed database' });
 }
});

// Start server only if not in test environment  
if (process.env.NODE_ENV !== 'test') { 
  connectDB().then(async () => {   
    // Auto-seed 100 activities on startup
    try {
      const Activity = require('./models/Activity');
      const { generateActivities } = require('./seeds/seedData');
      const count = await Activity.countDocuments();
      
      if (count < 100) {
        console.log('Seeding database with 100 activities...');
        await Activity.deleteMany({});
        const activitiesData = generateActivities(100);
        await Activity.insertMany(activitiesData, { ordered: false });
        console.log('Database seeded with 100 activities!');
      } else {
        console.log(`Database already has ${count} activities`);
      }
    } catch (err) {
      console.error('Auto-seed error:', err);
    }
    
    app.listen(PORT, () => {     
      console.log(`Server running on port ${PORT}`);   
    }); 
  }); 
}

module.exports=app;
