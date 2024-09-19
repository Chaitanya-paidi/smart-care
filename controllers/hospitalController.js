const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');



exports.registerHospital = async (req, res) => {
  const { hospitalName, address, name, email, password, phone, hospitalDescription } = req.body;

  if (!hospitalName || !address || !name || !email || !password || !phone) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }
    
    const user = new User({ name, email, password, phoneNumber: phone, role: 'hospitalAdmin' });
    await user.save();

    
    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path; 
    }

    const hospital = new Hospital({ 
      hospitalName, 
      address, 
      admin: user._id,
      image: imagePath,
      hospitalDescription, 
    });
    await hospital.save();

    res.status(201).json({ success: true, hospital, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.approveHospital = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid Hospital ID' });
      }
  
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return res.status(404).json({ success: false, message: 'Hospital not found' });
      }
  
      hospital.approved = true;
      await hospital.save();
  
      res.json({ success: true, hospital });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
};


exports.addDoctor = async (req, res) => {
  const { hospitalId, name, specialization, phone, email } = req.body;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path; 
    }

    const doctor = await Doctor.create({ name, specialization, phone, email, hospital: hospitalId, image: imagePath });
    hospital.doctors.push(doctor._id);

    await hospital.save();

    res.json({ success: true, doctor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPatientsByHospital = async (req, res) => {
  const { hospitalId } = req.params;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    // Find all appointments related to this hospital and populate the user details
    const appointments = await Appointment.find({ hospital: hospitalId }).populate('user', '-password');

    // Extract unique users (patients) from the appointments
    const patients = appointments.map(appointment => appointment.user);

    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getHospitalByAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;

    const hospital = await Hospital.findOne({ admin: adminId })
      .populate('services')
      .populate('doctors')
      .populate('admin')

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    const user = await User.findById(adminId).select('-password');  // Fetch user details without the password

    res.json({ 
      success: true, 
      hospital: {
        ...hospital.toObject(),  // Convert mongoose document to plain object
        hospitalDescription: hospital.hospitalDescription  // Ensure this field is included
      }, 
      user 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find(); 
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hospitals', error: error.message });
  }
};
// controllers/hospitalController.js

exports.updateHospital = async (req, res) => {
  const { hospitalName, address, description } = req.body;
  const hospitalId = req.params.id;

  try {
    // Check if the hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, error: "Hospital not found" });
    }

    // Handle image update if a new image file is provided
    if (req.file) {
      // Assuming the existing image should be replaced
      hospital.image = req.file.path; // Save the new image path
    }

    // Update hospital details
    if (hospitalName) hospital.hospitalName = hospitalName;
    if (address) hospital.address = address;
    if (description) hospital.description = description; // Update description

    await hospital.save();

    res.status(200).json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.getHospitalById = async (req, res) => {
  try {
    const hospitalId = req.params.id; // Get hospital ID from request parameters

    // Fetch hospital details by ID
    const hospital = await Hospital.findById(hospitalId)
      .populate("services", "name description cost") // Populate services with specific fields
      .populate("doctors", "name specialization phone email") // Populate doctors with specific fields
      .select("hospitalName address services doctors admin approved ratings image"); // Select specific fields to return

    // Check if hospital exists
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Return the filtered hospital data
    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.addHospitalRating = async (req, res) => {
//   const { hospitalId } = req.params; // Get hospital ID from URL parameters
//   const { userId, rating, comment } = req.body; // Get user ID, rating, and comment from the request body

//   try {
//     // Validate input data
//     if (!userId || !rating || rating < 1 || rating > 5) {
//       return res.status(400).json({ message: "Invalid input data" });
//     }

//     // Check if the hospital exists
//     const hospital = await Hospital.findById(hospitalId);
//     if (!hospital) {
//       return res.status(404).json({ message: "Hospital not found" });
//     }

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Create a new rating object
//     const newRating = {
//       user: userId,
//       rating,
//       comment,
//     };

//     // Add the new rating to the hospital's ratings array
//     hospital.ratings.push(newRating);

//     // Save the updated hospital to the database
//     await hospital.save();

//     res.status(200).json({ message: "Rating and review added successfully", ratings: hospital.ratings });
//   } catch (error) {
//     console.error("Error adding rating:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };





