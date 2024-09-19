// controllers/appointmentController.js

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Service = require('../models/Service');


exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ hospital: req.params.hospitalId })
      .populate('user', 'name email medicalProblem phoneNumber description');
      
    const formattedAppointments = appointments.map(appointment => {
      return {
        ...appointment._doc, 
        date: appointment.date.toLocaleDateString('en-GB')
      };
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/appointmentController.js
  exports.bookAppointment = async (req, res) => {
  const { hospitalId, serviceId, date, slot, name, age, bloodGroup, medicalStatus, prescription } = req.body; // Include serviceId in request body
  const userId = req.user._id;

  // Basic validation for required fields
  if (!hospitalId || !serviceId || !date || !slot || !name || !age || !bloodGroup) {
    return res.status(400).json({ success: false, message: "All required fields must be filled." });
  }

  try {
    // Fetch the hospital
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    // Fetch the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Check if the user already has an appointment in the same slot to prevent double booking
    const existingAppointment = await Appointment.findOne({ 
      user: userId, 
      hospital: hospitalId, 
      date, 
      slot 
    });

    if (existingAppointment) {
      return res.status(409).json({ success: false, message: "You already have an appointment booked at this time." });
    }

    // Create the new appointment
    const appointment = await Appointment.create({
      user: userId,
      hospital: hospitalId,
      service: serviceId,
      date,
      slot,
      name,
      age,
      bloodGroup,
      medicalStatus,
      prescription
    });

    // Link the appointment to the user's appointments array and save
    const user = await User.findById(userId);
    user.appointments.push(appointment._id);
    await user.save();

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, message: 'An error occurred while booking the appointment.' });
  }
};



exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status, slot, doctorId } = req.body;

  console.log("Received appointmentId:", appointmentId); // Log the appointmentId
  
  try {
    const updateFields = { status };
    if (slot) updateFields.slot = slot;
    if (doctorId) updateFields.doctorId = doctorId;

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, updateFields, { new: true });

    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    // Find the appointment and update its status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'cancelled' },
      { new: true } // Return the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};
