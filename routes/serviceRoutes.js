const express = require('express');
const router = express.Router();
const { addService, getServicesByHospital, deleteService, updateService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');


router.post('/add-service', protect, authorize('hospitalAdmin'), addService)
router.get('/get-service/hospital/:hospitalId', getServicesByHospital )
router.put('/update-service/:id', protect, authorize('hospitalAdmin'),updateService )
router.delete('/delete-service/:id', protect, authorize('hospitalAdmin'),deleteService )

module.exports = router;
