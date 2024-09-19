const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  availableSlots: [{ date: String, slot: String }],
  image: { type: String },
});

module.exports = mongoose.model('Doctor', doctorSchema);
