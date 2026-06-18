const express = require('express');
const router = express.Router();
const {
  sendInvitation,
  respondInvitation,
  getMyInvitations,
  getStoryInvitations,
} = require('../controllers/invitationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('author', 'admin'), sendInvitation);
router.patch('/:id', protect, authorize('contributor', 'author', 'admin'), respondInvitation);
router.get('/my-invitations', protect, authorize('contributor', 'author', 'admin'), getMyInvitations);
router.get('/story/:storyId', protect, authorize('author', 'admin'), getStoryInvitations);

module.exports = router;
