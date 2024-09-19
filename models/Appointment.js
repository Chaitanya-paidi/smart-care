
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  date: { type: Date, required: true },
  slot: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  name: { type: String, required: true }, 
  age: { type: Number, required: true }, 
  bloodGroup: { type: String, required: true }, 
  medicalStatus: { type: String }, 
  prescription: { type: String }, 
  invoices: [{ description: String, amount: Number }]
});

module.exports = mongoose.model('Appointment', appointmentSchema);
