const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getUserSubmissions,
  getUserBookmarks,
  createSubmission
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.get('/submissions', getUserSubmissions);
router.get('/bookmarks', getUserBookmarks);

module.exports = router;
