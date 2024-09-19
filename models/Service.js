const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  cost: { type: Number, required: true } // Add this line
});

module.exports = mongoose.model('Service', serviceSchema);
