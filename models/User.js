const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phoneNumber: { type: String, required: true },
  medicalProblem: { type: String },
  description: { type: String },
  role: { type: String, enum: ['user', 'hospitalAdmin', 'siteAdmin'], default: 'user' },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  image: { type: String },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed:', this.password); 
    next();
  } catch (err) {
    next(err);
  }
});


userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
