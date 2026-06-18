const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  searchUsers,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, searchUsers);

// Admin-only user management routes
router.get('/all-users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
