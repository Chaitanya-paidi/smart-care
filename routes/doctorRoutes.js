const express = require('express');
const router = express.Router();
const { updateDoctor, deleteDoctor, getDoctorsByHospital } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth'); 
const upload = require('../utils/upload');

router.get('/hospital/:hospitalId', protect, authorize('hospitalAdmin'), getDoctorsByHospital); 

router.put('/update-doctor/:id', protect, authorize('hospitalAdmin'), upload.single('image'), updateDoctor); 

router.delete('/delete-doctor/:id', protect, authorize('hospitalAdmin'), deleteDoctor); 

module.exports = router;
