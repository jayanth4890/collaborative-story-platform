const express = require('express');
const router = express.Router();
const {
  createContribution,
  reviewContribution,
  getMyContributions,
  getStoryContributions,
} = require('../controllers/contributionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('contributor', 'author', 'admin'), createContribution);
router.patch('/:id/review', protect, authorize('author', 'admin'), reviewContribution);
router.get('/my-contributions', protect, authorize('contributor', 'author', 'admin'), getMyContributions);
router.get('/story/:storyId', protect, authorize('contributor', 'author', 'admin'), getStoryContributions);

module.exports = router;
