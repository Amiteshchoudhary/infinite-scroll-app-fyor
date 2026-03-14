// Activity Model - MongoDB/Mongoose schema for activity data

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying with pagination and sorting by createdAt descending (newest first)
activitySchema.index({ createdAt : -1 });

module.exports = mongoose.model('Activity', activitySchema);
