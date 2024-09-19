const User = require('../models/User');
const Hospital = require('../models/Hospital'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, medicalProblem, description } = req.body;

  try {
    const user = await User.create({ name, email, password, phoneNumber, medicalProblem, description });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        medicalProblem: user.medicalProblem,
        description: user.description,
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        medicalProblem: user.medicalProblem,
        description: user.description,
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
  
  
exports.addRating = async (req, res) => {
    const { hospitalId, rating, comment } = req.body;
  
    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return res.status(404).json({ success: false, message: 'Hospital not found' });
      }
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const newRating = {
        user: req.user._id,
        userName: user.name,  
        rating,
        comment,

      };
  
      hospital.ratings.push(newRating);
      await hospital.save();
  
      res.json({ success: true, message: 'Rating added' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
};

exports.getUserAppointments = async (req, res) => {
  try {
        const user = await User.findById(req.user.id).populate('appointments');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, appointments: user.appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
  
