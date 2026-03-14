// Feed Routes - API endpoints for infinite scroll feed

const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// GET /api/feed - Fetch activities with pagination (cursor-based)
// Query params: lastId (optional), limit (default: 10)
router.get('/feed', async (req, res) => {
  try {
    const { lastId, limit = 10 } = req.query;
    
    let query = {};
    
    // If lastId provided, fetch items after this timestamp
    if (lastId) {
      query.createdAt = { $lt: new Date(lastId) };
    }
    
    // Fetch activities sorted by createdAt descending
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) + 1); // Fetch one extra to determine if there are more
    
    // Check if there are more items
    let hasMore = false;
    if (activities.length > parseInt(limit)) {
      activities.pop(); // Remove the extra item
      hasMore = true;
    }
    
    // Get the cursor for next page (timestamp of last item)
    const nextCursor = activities.length > 0 
      ? activities[activities.length - 1].createdAt.toISOString() 
      : null;
    
    res.json({
      data: activities,
      pagination: {
        hasMore,
        nextCursor
      }
    });
  } catch (error) {
 console.error('Error fetching feed:', error);
 res.status(500).json({ error: 'Failed to fetch feed' });
}
});

module.exports=router;
