const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const Hospital = require('../models/Hospital');

// @desc    Add a new service
// @route   POST /api/services
// @access  Private/Admin
const addService = asyncHandler(async (req, res) => {
  const { name, description, hospitalId, cost } = req.body;

  // Validate request data
  if (!name || !description || !hospitalId || cost === undefined) {
    res.status(400);
    throw new Error('All fields (name, description, hospitalId, cost) are required');
  }

  try {
    // Create a new service with the cost field
    const service = await Service.create({ name, description, hospital: hospitalId, cost });

    // Find the hospital
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      res.status(404);
      throw new Error('Hospital not found');
    }

    // Add the service to the hospital
    hospital.services.push(service._id);
    await hospital.save();

    // Respond with the newly created service
    res.status(201).json(service);
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// @desc    Get all services for a hospital
// @route   GET /api/services/hospital/:hospitalId
// @access  Private/Admin
const getServicesByHospital = asyncHandler(async (req, res) => {
  const services = await Service.find({ hospital: req.params.hospitalId });
  res.json(services);
});

const updateService = asyncHandler(async (req, res) => {
  const { name, description, cost } = req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    // Update service fields
    if (name) service.name = name;
    if (description) service.description = description;
    if (cost !== undefined) service.cost = cost;

    await service.save();
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  // Find the service by ID
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Find the hospital associated with the service
  const hospital = await Hospital.findById(service.hospital);

  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }

  // Remove the service
  await Service.deleteOne({ _id: req.params.id });

  // Remove the service ID from the hospital's services array
  hospital.services = hospital.services.filter((s) => s.toString() !== req.params.id);
  await hospital.save();

  res.json({ message: 'Service removed' });
});

module.exports = { addService, getServicesByHospital, deleteService, updateService };
