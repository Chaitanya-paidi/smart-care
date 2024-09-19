const express = require('express');
const { registerUser, loginUser, addRating, getUserAppointments } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/rating', protect, addRating);
router.get('/appointments', protect, getUserAppointments);

module.exports = router;
