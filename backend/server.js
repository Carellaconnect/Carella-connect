const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const app = express();
const router = express.Router(); // Define router

app.use(cors());
app.use(express.json());  // Middleware to parse JSON


// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Make sure to match the React app's URL
    methods: ['GET', 'POST', 'PUT'],
    credentials: true // Allow cookies (if using them)
}));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://carellaconnect:CarellaConnect@carellaconnect.h50ep.mongodb.net/Carella_Connect')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Carella Connect Backend!');
});

// const { check, validationResult } = require('express-validator');

/*const User= mongoose.model('User',{
    "name": String,//
    "email": String,//
    "password": String,//
    "role": String, //
    "profile_picture": String, //
    "phone": String, //
    "address": String, //
    "city": String, //
    "postcode": String, //
    "province": String, //
    "date_of_birth": Date, //
    "gender": String, //
    "created_at": Date,
    "updated_at": Date,
    "status": String, //
    "insurance_id": String,//
    "insurance_provider": String,//
    "hospital_id": String,//
    "doctor_identification_id": String
});*/

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    profile_picture: String,
    phone: String,
    address: String,
    city: String,
    postcode: String,
    province: String,
    date_of_birth: Date,
    gender: String,
    status: String,
    insurance_id: String,
    insurance_provider: String,
    hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    doctor_identification_id: String,
    created_at: Date,
    updated_at: Date,
});

const User = mongoose.model("User", UserSchema);
module.exports = User;



const DoctorsApprovalRrequests = mongoose.model('DoctorsApprovalRrequest', {
    "doctor_id": { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    "hospital_admin_id": String,
    "approval_status": String,
    "request_date": Date,
    "approval_date": Date,
    "notes": String,
    "created_at": Date,
    "updated_at": Date
});


//Appointment Details Colection
const AppointmentDetailsSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    appointment_date: Date,
    status: String,
    reason: String
});

const AppointmentDetails = mongoose.model("AppointmentDetails", AppointmentDetailsSchema);
module.exports = AppointmentDetails;


//Hospital colection
const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    city: String,
    contact_number: String,
    email: { type: String, required: true, unique: true },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Reference to Users (doctors)
});

const Hospital = mongoose.model("Hospital", HospitalSchema);
module.exports = Hospital;



//Doctor Profile collections
const DoctorProfileSchema = new mongoose.Schema({
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    speciality: { type: String, required: true },
    languages: [
        {
            language_name: String,
            language_code: String
        }
    ],
    availability: [
        {
            date: Date,
            time_slots: [
                {
                    start_time: Date,
                    end_time: Date,
                    status: String
                }
            ]
        }
    ]
});

const DoctorProfile = mongoose.model("DoctorProfile", DoctorProfileSchema);
module.exports = DoctorProfile;


var phoneregex = /^\(?(\d{3})\)?[\.\-\/\s]?(\d{3})[\.\-\/\s]?(\d{4})$/;

function phoneCheck(val) {
    if (val == null) {
        throw new Error('Phone number required');
    }
    if (!regCheck(val, phoneregex)) {
        throw new Error('Invalid phone number');
    }
    return true;
}

app.post('/register',
    //[
    // check('name','Please enter a name').notEmpty(), 
    // check('email','Email cannot be empty and should be in the specified format').isEmail(),
    // check('role','Please select a role.').notEmpty(), 
    // check('city','Please enter the city').notEmpty(), 
    // check('postcode','Please enter the postcode').notEmpty(), 
    // check('phone').custom(phoneCheck),
    // check('province', 'Please select the province').notEmpty(),
    // check('gender', 'Please select a gender').notEmpty(),
    // check('date_of_birth', 'Please ente the date of birth').notEmpty()
    //],
    async (req, res) => {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
        //     res.render('order',{errors:errors.array()});
        // }else{

        const email = req.body.email;

        try {

            let user = null;
            let status = 'Active';
            user = await User.findOne({ email });

            if (user == null) {
                if (req.body.role.toLowerCase() == 'doctor' || req.body.role.toLowerCase() == 'admin') {
                    status = 'Pending';
                }
                const newUser = new User({
                    "name": req.body.fname + ' ' + req.body.lname,
                    "email": req.body.email,
                    "password": req.body.password,
                    "role": req.body.role,
                    "profile_picture": req.body.profile_pic,
                    "phone": req.body.phone,
                    "address": req.body.address,
                    "city": req.body.city,
                    "postcode": req.body.postcode,
                    "province": req.body.province,
                    "date_of_birth": req.body.dob,
                    "gender": req.body.gender,
                    "created_at": new Date(),
                    "updated_at": new Date(),
                    "status": status,
                    "insurance_id": req.body.insuranceId,
                    "insurance_provider": req.body.insuranceProvider,
                    "hospital_id": req.body.hospitalId,
                    "doctor_identification_id": req.body.doctorId
                });

                await newUser.save().then(() => {
                    console.log('User Data saved.');
                });

                if (req.body.role.toLowerCase() === 'doctor') {
                    const doctorData = await User.findOne({ email: req.body.email });
                    const adminData = await User.aggregate([{ $match: { role: 'Admin', hospital_id: doctorData.hospital_id } }])
                    adminData.forEach(admin => {
                        //Add the details to the doctor_approvals collection
                        const doctorApproval = new DoctorsApprovalRrequests({
                            "doctor_id": doctorData._id,
                            "hospital_admin_id": admin._id,
                            "approval_status": "Pending",
                            "request_date": new Date(),
                            "approval_date": "",
                            "created_at": new Date(),
                            "updated_at": new Date()
                        });
                        doctorApproval.save().then(() => {
                            console.log("Data sent for Admin's approval.");
                        });
                    });

                }
                let message = 'Registration Successful!';
                if (req.body.role.toLowerCase() === 'doctor' || req.body.role.toLowerCase() === 'admin') {
                    message += ' Your account is pending approval. Please wait for approval from the admin.';
                } else {
                    message += ' Please login to your account.'
                }
                return res.json({
                    success: true,
                    message: message
                });

            } else {
                return res.status(401).json({ success: false, message: 'User with the given email id already exist.' });
            }

        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        // res.send('New User Added at Backend!');
        // }
    });

//Login API 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }


        const isMatch = password === user.password;

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }


        if (user.role === 'Doctor') {
            if (user.status === 'Pending') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account is pending approval. Please wait for approval from the admin.'
                });
            } else if (user.status === 'Rejected') {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been rejected. Please contact the admin for more information.'
                });
            }
        }

        // Login successful
        return res.json({
            success: true,
            message: 'Login successful!',
            role: user.role,
            status: user.status,
            user_id: user._id,  // Send user ID to frontend
            name: user.name // Send user name for display
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});


//API to fetch dr registration 

app.get("/doctors-approval-requests", async (req, res) => {
    try {

        const approvalRequests = await DoctorsApprovalRrequests.find()
            .populate('doctor_id', 'name email status')
            .populate('hospital_admin_id', 'name email')
            .exec();

        if (!approvalRequests || approvalRequests.length === 0) {
            return res.status(404).json({ message: "No approval requests found." });
        }

        res.json(approvalRequests);
    } catch (error) {
        console.error("Error fetching doctor approval requests:", error);
        res.status(500).json({ error: "Server error while fetching approval requests." });
    }
});


// Route to update doctor approval status
app.put('/update-doctor-approval/:id', async (req, res) => {
    const { status } = req.body;  // 'Approved' or 'Rejected'

    try {
        // Step 1: Update the doctor's approval request in the DoctorsApprovalRequests collection
        const updatedRequest = await DoctorsApprovalRrequests.findOneAndUpdate(
            { _id: req.params.id },
            { approval_status: status, approval_date: new Date() },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Approval request not found" });
        }

        // Step 2: If the doctor is approved, update the doctor's status in the User collection to 'Active'
        if (status === 'Approved') {
            // Find the doctor in the User collection and update their status to 'Active'
            const doctor = await User.findOneAndUpdate(
                { _id: updatedRequest.doctor_id },  // Assuming `doctor_id` is the user ID for the doctor
                { status: 'Active' },  // Set the status to 'Active'
                { new: true }  // Return the updated user document
            );

            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found in User collection" });
            }

            return res.json({ success: true, message: `Doctor approved successfully!`, updatedRequest, doctor });
        } else if (status === 'Rejected') {
            return res.json({ success: true, message: `Doctor rejected successfully!`, updatedRequest });
        }

    } catch (error) {
        console.error("Error updating approval status:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
});


// Route to fetch doctors with their profile details
app.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.aggregate([
            { $match: { role: 'doctor' } }, // Filter only doctors
            {
                $lookup: {
                    from: 'doctorprofiles',
                    localField: '_id',
                    foreignField: 'doctor_id',
                    as: 'profile'
                }
            },
            { $unwind: '$profile' } // Unwind profile details
        ]);

        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API to fetch doctors filtered according to speciality and language for appointment booking from patient's side
app.get('/filtered-doctors', async (req, res) => {
    try {
      const { specialty, language } = req.query;
  
      if (!specialty || !language) {
        return res.status(400).json({ error: "Specialty and language are required" });
      }
  
      const doctorProfiles = await DoctorProfile.find({
        speciality: specialty,
        languages: { $elemMatch: { language_name: language } }
      }).populate({
        path: 'doctor_id',
        select: 'name hospital_id'
      });
  
      const enrichedDoctors = await Promise.all(
        doctorProfiles.map(async (profile) => {
          let hospital = null;
  
          if (profile.doctor_id.hospital_id) {
            hospital = await Hospital.findById(profile.doctor_id.hospital_id).select('name');
          }
  
          return {
            doctor_name: profile.doctor_id.name,
            speciality: profile.speciality,
            languages: profile.languages.map(lang => lang.language_name),
            hospital_name: hospital ? hospital.name : "N/A",
            hospital_address: hospital ? hospital.address : "N/A" ,
            availability: profile.availability.map(avail => ({
                date: avail.date.toISOString().split('T')[0],  // Format Date (YYYY-MM-DD)
                time_slots: avail.time_slots.map(slot => ({
                    start_time: new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    end_time: new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: slot.status
                }))
            }))
          };
        })
      );
  
      res.json(enrichedDoctors);
    } catch (error) {
      console.error("Error in /filtered-doctors:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


//Fetch upcoming appointments
app.get('/patient-dashboard/:id', async (req, res) => {
    try {
        const patientId = req.params.id;
        const today = new Date();

        const appointments = await AppointmentDetails.find({
            patient_id: patientId,
            appointment_date: { $gte: today }  // Fetch only future appointments
        })
            .populate('doctor_id', 'name')  // Fetch doctor name
            .populate('hospital_id', 'name') // Fetch hospital name
            .exec();

        const formattedAppointments = appointments.map(appt => ({
            _id: appt._id,
            appointment_date: appt.appointment_date,
            doctor_name: appt.doctor_id.name,
            hospital_name: appt.hospital_id.name,
        }));

        res.json(formattedAppointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


//Fetch past appointments
app.get('/patient-dashboard/:id/past-appointments', async (req, res) => {
    try {
        const patientId = req.params.id;
        const today = new Date();
        today.setHours(23, 59, 59, 999);  // Ensure full day is considered

        const pastappointments = await AppointmentDetails.find({
            patient_id: patientId,
            appointment_date: { $lt: today }  // Fetch only past appointments
        })
            .populate('doctor_id', 'name')  // Fetch doctor name
            .populate('hospital_id', 'name') // Fetch hospital name
            .exec();

        const formattedpastAppointments = pastappointments.map(pastappt => ({
            _id: pastappt._id,
            appointment_date: pastappt.appointment_date,
            doctor_name: pastappt.doctor_id.name,
            hospital_name: pastappt.hospital_id.name,
        }));

        res.json(formattedpastAppointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseURL = `http://localhost:${PORT}`; // Update this if running on a server
    console.log(`Server running at ${baseURL}`);
});
