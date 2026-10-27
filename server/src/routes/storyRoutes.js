const express = require('express');
const router = express.Router();
const {
  getStories,
  getFeaturedStories,
  getPopularStories,
  getRecentStories,
  getStoryBySlug,
  getMapStories,
  getRegions,
  searchStories
} = require('../controllers/storyController');
const { addBookmark, removeBookmark } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Public story endpoints
router.get('/featured', getFeaturedStories);
router.get('/popular', getPopularStories);
router.get('/recent', getRecentStories);
router.get('/map', getMapStories);
router.get('/', getStories);
router.get('/:slug', getStoryBySlug);

// Bookmarking for specific story
router.post('/:id/bookmark', authenticate, addBookmark);
router.delete('/:id/bookmark', authenticate, removeBookmark);

module.exports = router;
