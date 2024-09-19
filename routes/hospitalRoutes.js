// routes/hospitalRoutes.js
const express = require('express');
const { registerHospital, approveHospital, addService, addDoctor, getHospitalByAdmin, getPatientsByHospital, getAllHospitals, updateHospital, getHospitalById } = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/register', upload.single('image'), registerHospital);
router.put('/approve/:id', protect, authorize('siteAdmin'), approveHospital);
// router.post('/service', protect, authorize('hospitalAdmin'), addService);
router.post('/doctor', protect, authorize('hospitalAdmin'), upload.single('image'), addDoctor);
router.get('/my-hospital', protect, authorize('hospitalAdmin'), getHospitalByAdmin);
router.get('/get-patients/:hospitalId',protect, authorize('hospitalAdmin'), getPatientsByHospital)
router.get('/fetch-hospitals', getAllHospitals);
router.put('/update/:id', protect, authorize('hospitalAdmin'), upload.single('image'), updateHospital);
router.get('/hospital-details/:id', getHospitalById);


module.exports = router;
