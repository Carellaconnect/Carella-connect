const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const nodemailer = require("nodemailer");
const sendEmail = require("./emailService");
const twilio = require('twilio');
require('dotenv').config();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const app = express();
const router = express.Router(); // Define router
const rateLimit = require('express-rate-limit');


//app.use(cors());
app.use(express.json());  // Middleware to parse JSON

console.log("Server Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);


// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true
// }));

// Trust the proxy to get the correct IP (important for localhost + proxies)
app.set('trust proxy', 1);

//Log IP address for every request (add here)
app.use((req, res, next) => {
    // console.log("IP Address:", req.ip);
    next();
  });


//Limit login attempts to 5 per 10 minutes per IP only for unsuccessful attempts
const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Too many failed login attempts. Please try again after 5 minutes.',
        });
    },
    keyGenerator: (req) => req.ip,
    skipSuccessfulRequests: true //this is important!
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));
// mongoose.connect('mongodb+srv://carellaconnect:CarellaConnect@carellaconnect.h50ep.mongodb.net/Carella_Connect')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Carella Connect Backend!');
});

// const { check, validationResult } = require('express-validator');


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
    license_number: String,
    speciality: String,
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


//Appointment Details Collection
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

//Hospital Collection
const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
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

const EmergencyRequest = mongoose.model('EmergencyRequest', {
    name: String,
    emergencyType: String,
    location: String,
    details: String,
    urgency: String,
    phoneNumber: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending',
      },
    createdAt: { type: Date, default: Date.now }
});

const MedicalRecords = mongoose.model('MedicalRecords', {
    patientName: String,
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    email: String,
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AppointmentDetailsSchema', default: null },
    appointmentDate: String,
    reason: String,
    allergies: String,
    diagnosis: String,
    medication: String, 
    createdAt: { type: Date, default: Date.now }
});


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
            if(req.body.role.toLowerCase() == 'doctor' || req.body.role.toLowerCase() == 'admin'){
                status = 'Pending';
            }
            const newUser = new User({
            "name": req.body.fname+' '+req.body.lname, 
            "email": req.body.email,
            "password": req.body.password,
            "role": req.body.role.toLowerCase(),    
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
            "doctor_identification_id": req.body.doctorId,
            "license_number": req.body.licenseNumber,
            "speciality": req.body.speciality
            });

                await newUser.save().then(() => {
                    console.log('User Data saved.');
                });
                console.log('role >>'+req.body.role);
                if (req.body.role.toLowerCase() === 'doctor') {
                    const doctorData = await User.findOne({ email: req.body.email });
                    const adminData = await User.aggregate([{ $match: { role: 'admin', hospital_id: doctorData.hospital_id } }])
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
// Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
   
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email' });
      }
  
      const isMatch = password === user.password;
      console.log("Password matched:", isMatch);
  
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
  
      if (user.role.toLowerCase() === 'doctor') {
        console.log("Doctor status:", user.status); 
  
        if (user.status.toLowerCase() === 'pending') {
          return res.status(403).json({
            success: false,
            message: 'Your account is pending approval. Please wait for approval from the admin.'
          });
        }
        if (user.status.toLowerCase() === 'rejected') {
          return res.status(403).json({
            success: false,
            message: 'Your account has been rejected. Please contact the admin for more information.'
          });
        }
      }
  
      return res.json({
        success: true,
        message: 'Login successful!',
        user: {   
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            city: user.city,
            province: user.province,
            postcode: user.postcode,
            date_of_birth: user.date_of_birth,
            gender: user.gender,
            status: user.status
        }
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
    const { status } = req.body;

    try {
        const updatedRequest = await DoctorsApprovalRrequests.findOneAndUpdate(
            { _id: req.params.id },
            { approval_status: status, approval_date: new Date() },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Approval request not found" });
        }

        let doctor = await User.findOne({ _id: updatedRequest.doctor_id });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found in User collection" });
        }

        if (status === 'Approved') {
            doctor = await User.findOneAndUpdate(
                { _id: updatedRequest.doctor_id },
                { status: 'Active' },
                { new: true }
            );
        }

       
        const emailSubject = status === "Approved" ? "Doctor Approval - Accepted" : "Doctor Approval - Rejected";
        const emailMessage = status === "Approved"
            ? `Dear ${doctor.name},\n\nYour account has been approved! You can now access the system.\n\nBest Regards,\nCarella Connect`
            : `Dear ${doctor.name},\n\nWe regret to inform you that your account has been rejected.\n\nBest Regards,\nCarella Connect`;

        await sendEmail(doctor.email, emailSubject, emailMessage);

       
        return res.json({ 
            success: true, 
            message: `Doctor ${status.toLowerCase()} successfully!`, 
            updatedRequest, 
            doctor 
        });

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

        const today = new Date(); // Get current date and time

        // Fetch doctor profiles matching specialty & language
        const doctorProfiles = await DoctorProfile.find({
            speciality: specialty,
            languages: { $elemMatch: { language_name: language } }
        }).populate({
            path: 'doctor_id',
            select: 'name'
        });

        // Process each doctor and fetch their hospital details
        const enrichedDoctors = await Promise.all(
            doctorProfiles.map(async (profile) => {
                const hospital = await Hospital.findOne({ doctors: profile.doctor_id._id })
                    .select('name address');

                return {
                    doctor_name: profile.doctor_id.name,
                    speciality: profile.speciality,
                    languages: profile.languages.map(lang => lang.language_name),
                    hospital_name: hospital ? hospital.name : "N/A",
                    hospital_address: hospital ? hospital.address : "N/A",
                    availability: profile.availability
                        .filter(avail => new Date(avail.date) >= today) // Filter past dates
                        .map(avail => ({
                            date: avail.date.toISOString().split('T')[0],
                            time_slots: avail.time_slots
                                .filter(slot => new Date(slot.start_time) > today && slot.status === "Available") // Future and available slots only
                                .map(slot => ({
                                    start_time: new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    end_time: new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    status: slot.status
                                }))
                        }))
                        .filter(avail => avail.time_slots.length > 0) // Remove empty availability entries
                };
            })
        );

        res.json(enrichedDoctors);
    } catch (error) {
        console.error("Error in /filtered-doctors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/* ------------------------------------------------------------------------------------------------ */
//fetch the doctor's _id from the users collection based on the provided doctorName.
app.get('/get-doctor-id/:doctorName', async (req, res) => {
    try {
        const { doctorName } = req.params;

        if (!doctorName) {
            return res.status(400).json({ success: false, message: "Doctor name is required" });
        }

        // Find doctor by name (ensure case-insensitive search)
        const doctor = await User.findOne({ name: { $regex: new RegExp("^" + doctorName + "$", "i") }, role: "Doctor" });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.status(200).json({ doctor_id: doctor._id.toString() }); // Ensure ObjectId is returned as a string
    } catch (error) {
        console.error("Error fetching doctor ID:", error);
        res.status(500).json({ success: false, message: "Server error while fetching doctor ID" });
    }
});

//fetch the hospital's _id from the hospitals collection based on the provided HospitalName.
app.get('/get-hospital-id/:hospital', async (req, res) => {
    try {
        const { hospital } = req.params;

        if (!hospital) {
            return res.status(400).json({ success: false, message: "Hospital name is required" });
        }

        // Find doctor by name (ensure case-insensitive search)
        const thehospital = await Hospital.findOne({ name: { $regex: new RegExp("^" + hospital + "$", "i") }});

        if (!thehospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        res.status(200).json({ hospital_id: thehospital._id.toString() }); // Ensure ObjectId is returned as a string
    } catch (error) {
        console.error("Error fetching Hospital ID:", error);
        res.status(500).json({ success: false, message: "Server error while fetching Hospital ID" });
    }
});


//API to create a new appointment - after confirming the appointment on /book-appointment page (from patient's side):
app.post('/appointments', async (req, res) => {
    try {
        console.log("Received appointment data:", req.body); // Log received data

        const { patient_id, doctor_id, hospital_id, appointment_date, status, reason } = req.body;

        // Validate required fields
        if (!hospital_id || !patient_id || !doctor_id || !appointment_date || !status || !reason) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Create new appointment directly using doctor_id
        const newAppointment = new AppointmentDetails({
            patient_id,
            doctor_id,  // Directly use the received doctor_id
            hospital_id,
            appointment_date,
            status,
            reason
        });

        // Save to database
        await newAppointment.save();

        res.status(201).json({ success: true, message: "Appointment created successfully", appointment: newAppointment });

    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ success: false, message: "Server error while creating appointment" });
    }
});


/* ------------------------------------------------------------------------------------------------ */


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

//API to delete an appointment based on its _id.
app.delete('/appointments/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        console.log("Deleting appointment with ID:", appointmentId); // Debugging log

        const deletedAppointment = await AppointmentDetails.findByIdAndDelete(appointmentId);

        if (!deletedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        console.error("Error canceling appointment:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

//Test API
app.get('/test', (req, res) => {
    res.json({ message: "Backend is running fine!" });
});

//Api for emergency request Form
app.post('/api/emergency', async (req, res) => {
    try {
        const { name, emergencyType, location, details, urgency, phoneNumber, userId } = req.body;
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);


        if (!emergencyType || !location || !urgency || !phoneNumber) {
            return res.status(400).json({ success: false, message: "Required fields are missing!" });
        }

        
        let responseMessage = "";
        if (urgency === "High") {
            responseMessage = "Your request is serious! A team member will call you from (519)-6893-456 within 30 minutes.";
        } else if (urgency === "Medium") {
            responseMessage = "Your request has been recorded. Expect a call from (519)-6893-456 within 2 hours.";
        } else {
            responseMessage = "Your request has been noted. We will reach out from (519)-6893-456 within 24 hours.";
        }

        const newRequest = new EmergencyRequest({
            name: userId ? null : name, 
            emergencyType,
            location,
            details,
            urgency,
            phoneNumber: formattedPhoneNumber,
            userId: userId || null,
        });

        await newRequest.save();
        return res.status(201).json({ success: true, message: responseMessage });

    } catch (error) {
        console.error("Error submitting emergency request:", error);
        res.status(500).json({ success: false, message: "Server error while submitting request." });
    }
});
// Function to format the phone number
function formatPhoneNumber(phoneNumber) {
    
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if the cleaned phone number is exactly 10 digits
    if (cleaned.length === 10) {
        // Format the phone number as XXX-XXX-XXXX
        return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else {
        // Return null if the phone number is not valid
        return null;
    }
}

// Get all emergency requests
app.get('/api/emergency-requests', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const emergencyRequests = await EmergencyRequest.find().populate('userId', 'name email'); // Populate user details if available
        res.json({ success: true, data: emergencyRequests });
    } catch (error) {
        console.error("Error fetching emergency requests:", error);
        res.status(500).json({ success: false, message: "Server error while fetching emergency requests." });
    }
});


app.put('/api/emergency-requests/:id', async (req, res) => {
    const { status } = req.body;

    if (!status || !['In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status. Valid statuses are 'In Progress' or 'Resolved'." });
    }

    try {
        
        const updatedEmergency = await EmergencyRequest.findByIdAndUpdate(
            req.params.id,
            { status: status, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedEmergency) {
            return res.status(404).json({ success: false, message: "Emergency request not found" });
        }

        
        if (updatedEmergency.phoneNumber) {
            const message = status === 'In Progress'
                ? `Your emergency request is now being processed. \nTeam Carella Connect.`
                : `Your emergency request has been resolved. Thank you for your patience. \nTeam Carella Connect`;

            try {
                // Send SMS using Twilio
                
                await client.messages.create({
                    body: message,
                    from: process.env.TWILIO_PHONE_NUMBER, 
                    to: updatedEmergency.phoneNumber, 
                });
                console.log(`SMS sent to ${updatedEmergency.phoneNumber}`);
            } catch (smsError) {
                console.error("Error sending SMS:", smsError);
                return res.status(500).json({ success: false, message: "Failed to send SMS" });
            }
        }

        return res.json({
            success: true,
            message: `Emergency request updated to '${status}' successfully.`,
            updatedEmergency
        });

    } catch (error) {
        console.error("Error updating emergency request:", error);
        return res.status(500).json({ success: false, message: "Server error while updating the emergency request." });
    }
});





app.get('/api/hospital-data', async (req, res) => {

    try {
        
        const hospitalsList = await Hospital.find().exec();
    
        if (!hospitalsList || hospitalsList.length === 0) {
          return res.status(404).json({ message: "No hospitals found." });
        }
    
        res.json(hospitalsList);
      } catch (error) {
        console.error("Error fetching list of hospitals:", error);
        res.status(500).json({ error: "Server error while fetching hospitals list." });
      }
});


app.get('/api/upcoming-appointments/:doctorId', async (req, res) => {
    try {
      const { doctorId } = req.params; // Get doctor ID from the request
  
      if (!doctorId) {
        return res.status(400).json({ message: 'Doctor ID is required' });
      }
  
      const appointments = await AppointmentDetails.find({ 
          doctor_id: doctorId,  // Filter by doctor ID
          status: 'Scheduled' 
        })
        .populate('patient_id', 'name email phone gender') // Populate patient details
        .exec();
  
      if (appointments.length === 0) {
        return res.status(200).json({ data: [] }); // ✅ Return an empty array instead of 404
      }
  
      res.json({ data: appointments });
  
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    }
});
// Route to cancel (discard) an appointment
app.put('/api/appointments/cancel/:id', async (req, res) => {
    try {
      const appointmentId = req.params.id;
  
      // Update the status of the appointment to 'Cancelled'
      const updatedAppointment = await AppointmentDetails.findByIdAndUpdate(
        appointmentId,
        { status: 'Cancelled' }, // Change the status to 'Cancelled'
        { new: true } // Return the updated appointment
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      // Respond with the updated appointment
      res.json({ message: 'Appointment cancelled successfully', data: updatedAppointment });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ message: 'Error cancelling appointment' });
    }
  });  

//Update Appointment API 
app.post('/updateAppointment', async (req, res) => {
    const appointmentId = req.body.appointmentId;
    try {
        const medicalRecords = await MedicalRecords.findOne({ appointmentId });
        if(medicalRecords == null) {
            const newRecord = new MedicalRecords ({
                "patientName": req.body.patientName, 
                "patientId": req.body.patientId,
                "email": req.body.email,
                "appointmentId": req.body.appointmentId,  
                "appointmentDate": req.body.appointmentDate,
                "reason": req.body.reason,
                "allergies": req.body.allergies,
                "diagnosis": req.body.diagnosis,
                "medication": req.body.medication
            });
            await newRecord.save().then(() => {
                console.log('Medical record saved.');
            });
            return res.json({
                success: true,
                message: 'Medical record created successfully!'
            });

        } else {
            medicalRecords.patientName = req.body.patientName;
            medicalRecords.patientId = req.body.patientId;
            medicalRecords.email = req.body.email;
            medicalRecords.appointmentId = req.body.appointmentId;
            medicalRecords.appointmentDate = req.body.appointmentDate;
            medicalRecords.reason = req.body.reason;
            medicalRecords.allergies = req.body.allergies;
            medicalRecords.diagnosis = req.body.diagnosis;
            medicalRecords.medication = req.body.medication;
            const updatedRecord = await MedicalRecords.findByIdAndUpdate(
                medicalRecords._id,
                medicalRecords,
                { new: true }
            );
            return res.json({
                success: true,
                message: 'Medical record updated successfully!'
            });
        }

    } catch (error) {
        console.error('Error during appointment updation:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

//Complete appointment Api
app.post('/completeConsultation', async (req, res) => {
    const appointmentId = req.body.appointmentId;
    const appointmentDetails = await AppointmentDetails.find({ 
        _id: appointmentId
      })
      .populate('patient_id', 'name email phone gender') // Populate patient details
      .exec();
    try {
        const medicalRecords = await MedicalRecords.findOne({ appointmentId });
        if(medicalRecords == null) {
            const newRecord = new MedicalRecords ({
                "patientName": req.body.patientName, 
                "patientId": req.body.patientId,
                "email": req.body.email,
                "appointmentId": req.body.appointmentId,  
                "appointmentDate": req.body.appointmentDate,
                "reason": req.body.reason,
                "allergies": req.body.allergies,
                "diagnosis": req.body.diagnosis,
                "medication": req.body.medication
            });
            await newRecord.save().then(() => {
                console.log('Medical record saved.');
            });

        } else {
            medicalRecords.patientName = req.body.patientName;
            medicalRecords.patientId = req.body.patientId;
            medicalRecords.email = req.body.email;
            medicalRecords.appointmentId = req.body.appointmentId;
            medicalRecords.appointmentDate = req.body.appointmentDate;
            medicalRecords.reason = req.body.reason;
            medicalRecords.allergies = req.body.allergies;
            medicalRecords.diagnosis = req.body.diagnosis;
            medicalRecords.medication = req.body.medication;
            const updatedRecord = await MedicalRecords.findByIdAndUpdate(
                medicalRecords._id,
                medicalRecords,
                { new: true }
            );
        }
        const updatedAppointment = await AppointmentDetails.findByIdAndUpdate(
            appointmentId,
            { status: 'Completed' }, // Change the status to 'Completed'
            { new: true } // Return the updated appointment
          );
        return res.json({
            success: true,
            message: 'Medical record updated and consultation completed successfully!'
        });

    } catch (error) {
        console.error('Error during appointment completion:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/fetchMedicalRecords/:appt_id', async (req, res) => {
    try {
      const { appt_id } = req.params;
  
      if (!appt_id) {
        return res.status(400).json({ message: 'Appointmnet Id is required' });
      }
  
      const medicalRecords = await MedicalRecords.find({ 
          appointmentId: appt_id,
        }).exec();
  
      res.json({ data: medicalRecords });
  
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    }
});

app.get('/api/fetchMedicalRecords/:appt_id', async (req, res) => {
    try {
      const { appt_id } = req.params;
  
      if (!appt_id) {
        return res.status(400).json({ message: 'Appointmnet Id is required' });
      }
  
      const medicalRecords = await MedicalRecords.find({ 
          appointmentId: appt_id,
        }).exec();
  
      res.json({ data: medicalRecords });
  
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    }
});

app.get('/api/getAllPreviousRecords/:patientId', async (req, res) => {
    try {
      const { patientId } = req.params;
  
      if (!patientId) {
        return res.status(400).json({ message: 'Patient Id is required' });
      }
  
      const medicalRecords = await MedicalRecords.find({ 
          patientId: patientId,
        }).exec();
  
      res.json({ data: medicalRecords });
  
    } catch (error) {
      console.error('Error fetching medical records:', error);
      res.status(500).json({ message: 'Error fetching medical records' });
    }
});

//getMedicalRecordById
app.get('/api/getMedicalRecordById/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Record Id is required' });
      }
      const medicalRecords = await MedicalRecords.find({ 
        _id: id,
      }).exec();
      res.json({ data: medicalRecords });
  
    } catch (error) {
      console.error('Error fetching medical records:', error);
      res.status(500).json({ message: 'Error fetching medical records' });
    }
});


// Doctor availability 

app.get('/doctor/availability/:doctorId', async (req, res) => {
    try {
      const { doctorId } = req.params;
      const doctorProfile = await DoctorProfile.findOne({ doctor_id: doctorId });
  
      if (!doctorProfile) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
  
      res.json(doctorProfile.availability);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching availability data', error: err });
    }
  });
  


  
  // Add new time slot
  app.post('/doctor/add-time-slot/:doctorId', async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { date, time_slot } = req.body;
  
      const doctor = await DoctorProfile.findOne({ doctor_id: doctorId });
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Find the availability entry for the selected date
      const availabilityIndex = doctor.availability.findIndex(
        (avail) => avail.date.toISOString().split('T')[0] === date
      );
  
      if (availabilityIndex > -1) {
        // If date exists, add the time slot to the existing array
        doctor.availability[availabilityIndex].time_slots.push(time_slot);
      } else {
        // If date does not exist, create a new entry
        doctor.availability.push({ date: new Date(date), time_slots: [time_slot] });
      }
  
      await doctor.save();
      res.json({ message: 'Time slot added successfully' });
    } catch (err) {
      console.error('Error adding time slot:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.put('/doctor/update-time-slot/:doctorId', async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { date, index, time_slot } = req.body;
  
      let doctor = await DoctorProfile.findOne({ doctor_id: doctorId });
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  
      let dayAvailability = doctor.availability.find(avail => avail.date.toISOString().split('T')[0] === date);
      if (!dayAvailability) return res.status(404).json({ message: 'No availability found for this date' });
  
      dayAvailability.time_slots[index] = time_slot;
      await doctor.save();
      res.json({ message: 'Time slot updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err });
    }
  });
  
  // Delete a time slot
  app.delete('/doctor/delete-time-slot/:doctorId', async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { date, index } = req.body;
  
      let doctor = await DoctorProfile.findOne({ doctor_id: doctorId });
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  
      let dayAvailability = doctor.availability.find(avail => avail.date.toISOString().split('T')[0] === date);
      if (!dayAvailability) return res.status(404).json({ message: 'No availability found for this date' });
  
      dayAvailability.time_slots.splice(index, 1);
      await doctor.save();
      res.json({ message: 'Time slot deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err });
    }
  });
  

  // GET medical record by appointmentId
app.get("/medicalrecords/:appointmentId", async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        // Find medical record by appointmentId
        const record = await MedicalRecords.findOne({ appointmentId });

        if (!record) {
            return res.status(404).json({ message: "Medical record not found" });
        }

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

//App Admin integration

// Get All Hospitals
app.get('/api/hospitals', async (req, res) => {
    try {
      const hospitals = await Hospital.find();
      res.json(hospitals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching hospitals' });
    }
  });

// // Add Hospital
app.post('/api/hospitals', async (req, res) => {
    try {
      const newHospital = new Hospital(req.body);
      await newHospital.save();
      res.status(201).json(newHospital);
    } catch (error) {
      res.status(500).json({ message: 'Error adding hospital' });
    }
  });

  // update hospital

  app.put('/api/hospitals/:id', async (req, res) => {
    try {
      const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedHospital);
    } catch (error) {
      res.status(500).json({ message: 'Error updating hospital' });
    }
  });

  
 // Delete Hospital
app.delete('/api/hospitals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findByIdAndDelete(id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json({ message: 'Hospital deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting hospital' });
  }
});
  
 // Add Hospital Admin
app.post("/add-admin", async (req, res) => {
    try {
        const newAdmin = new User({ ...req.body, role: "hospital_admin" });
        await newAdmin.save();
        res.status(201).json({ message: "Admin added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch doctors by hospital ID
app.get('/api/doctors/hospital/:hospitalId', async (req, res) => {
    try {
      const { hospitalId } = req.params;
      const doctors = await User.find({ hospital_id: hospitalId, role: { $regex: /^doctor$/, $options: 'i' } });  // Fetching doctors from the User model with hospital_id field
      res.status(200).json(doctors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching doctors' });
    }
  });
// Fetch admin by hospital

app.get('/api/admins/hospital/:hospitalId', async (req, res) => {
    try {
      const { hospitalId } = req.params;
      const admins = await User.find({ hospital_id: hospitalId, role: { $regex: /^admin$/, $options: 'i' } }); // Filter by role
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admins' });
    }
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseURL = `http://localhost:${PORT}`; // Update this if running on a server
    console.log(`Server running at ${baseURL}`);
});