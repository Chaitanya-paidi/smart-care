const express = require('express');
const { bookAppointment, updateAppointmentStatus, getAppointments, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/hospital/:hospitalId', protect, authorize('hospitalAdmin'), getAppointments)
router.post('/book', protect, authorize('user'), bookAppointment);
router.put('/status/:appointmentId', protect, authorize('hospitalAdmin'), updateAppointmentStatus);
router.put('/cancel/:appointmentId', protect, authorize('hospitalAdmin'), cancelAppointment);

module.exports = router;
