const express = require('express');
const router = express.Router();

// Controllers
const {
    signUp,
    login,
    sendOTP,
    changePassword
} = require('../controllers/auth');


// Resetpassword controllers
const {
    resetPasswordToken,
    resetPassword,
} = require('../controllers/resetPassword');

//middlewares
// Middleware
const { auth, isAdmin } = require('../middlewares/auth');
const { getAllStudents, getAllInstructors } = require('../controllers/profile');

// Routes for Login, Signup, and Authentication
//   Authentication routes


// Route for user signup
router.post('/signup', signUp);

// Route for user login
router.post('/login', login);

// Route for sending OTP to the user's email
router.post('/sendotp', sendOTP);

// Route for Changing the password
router.post('/changepassword', auth, changePassword);

// Reset Password
// route for  =>reset password token genrate karne ke lie
router.post('/reset-password-token', resetPasswordToken);


//route for =>user ke password aur verification  ko reset karne ke lie
router.post("/reset-password", resetPassword)

//only for Admin  => getAllStudents & getAllInstructors
router.get("/all-students", auth, isAdmin)
router.get("/all-instructors", auth, isAdmin)


module.exports = router



