const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const app = express();
app.use("/images", express.static("public/images"));

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://carellaconnect:CarellaConnect@carellaconnect.h50ep.mongodb.net/Carella_Connect')
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
    "doctor_id": String,
    "hospital_admin_id": String,
    "approval_status": String,
    "request_date": Date,
    "approval_date": Date,
    "notes": String,
    "created_at": Date,
    "updated_at": Date
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

        const newUser = new User({
            "name": req.body.name, 
            "email": req.body.email,
            "password": req.body.password,
            "role": req.body.role,    
            "profile_picture": req.body.profile_pic,  
            "phone": req.body.phone,
            "address": req.body.address,
            "city": req.body.city,
            "postcode": req.body.postcode,
            "province": req.body.province,
            "date_of_birth": req.body.date_of_birth,  
            "gender": req.body.gender,   
            "created_at": new Date(), 
            "updated_at": new Date(), 
            "status": 'Active', 
            "insurance_id": req.body.insurance_id,  
            "insurance_provider": req.body.insurance_provider,
            "hospital_id": req.body.hospital_id,
            "doctor_identification_id": req.body.doctor_identification_id
        });

        await newUser.save().then(() => {
            console.log('User Data saved.');
        });

        if(req.body.role == 'Doctor'){
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
        res.send('New User Added at Backend!');
   // }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const baseURL = `http://localhost:${PORT}`; // Update this if running on a server
    console.log(`Server running at ${baseURL}`);
});
