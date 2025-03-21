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


// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT'],
    credentials: true 
}));
app.use(express.json());
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true
// }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Simple route
app.get('/', (req, res) => {
    res.send('Hello from Carella Connect Backend!');
});

// const { check, validationResult } = require('express-validator');

const User= mongoose.model('User',{
    "name": String,
    "email": String,
    "password": String,
    "role": String,
    "profile_picture": String,
    "phone": String,
    "address": String,
    "city": String,
    "postcode": String,
    "province": String,
    "date_of_birth": Date,
    "gender": String,
    "created_at": Date,
    "updated_at": Date,
    "status": String,
    "insurance_id": String,
    "insurance_provider": String,
    "hospital_id": String,
    "doctor_identification_id": String
});

const DoctorsApprovalRrequests = mongoose.model ('DoctorsApprovalRrequest', {
    "doctor_id": { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    "hospital_admin_id": String,
    "approval_status": String,
    "request_date": Date,
    "approval_date": Date,
    "notes": String,
    "created_at": Date,
    "updated_at": Date
});


const Doctors = mongoose.model ('Doctor', {
    "doctor_id": { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    "name": String,
    "specialty": String,
    "location": String,
    "languages": String,
    "address" : String,
    "availability": {
        type: Map,
        of: [{
          startTime: String, // e.g., "09:00 AM"
          endTime: String,   // e.g., "05:00 PM"
          isAvailable: Boolean
        }]
      },
      "createdAt": Date
});


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


var phoneregex = /^\(?(\d{3})\)?[\.\-\/\s]?(\d{3})[\.\-\/\s]?(\d{4})$/;

function phoneCheck(val){
    if(val == null) {
      throw new Error('Phone number required');
    }
    if( !regCheck(val,phoneregex)){
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
 async(req, res) => {
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

            if(req.body.role.toLowerCase() === 'doctor'){
                const doctorData = await User.findOne({email: req.body.email});
                const adminData = await User.aggregate([ {$match: {role:'Admin', hospital_id: doctorData.hospital_id}} ])
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
            if(req.body.role.toLowerCase() === 'doctor' || req.body.role.toLowerCase() === 'admin'){
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
            status: user.status 
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

//Api for emergency request Form

app.post('/api/emergency', async (req, res) => {
    try {
        const { name, emergencyType, location, details, urgency, phoneNumber, userId } = req.body;

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
            phoneNumber,
            userId: userId || null,
        });

        await newRequest.save();
        return res.status(201).json({ success: true, message: responseMessage });

    } catch (error) {
        console.error("Error submitting emergency request:", error);
        res.status(500).json({ success: false, message: "Server error while submitting request." });
    }
});

// Get all emergency requests
app.get('/api/emergency-requests', async (req, res) => {
    try {
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseURL = `http://localhost:${PORT}`; // Update this if running on a server
    console.log(`Server running at ${baseURL}`);
});
