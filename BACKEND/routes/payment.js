const express = require("express");
const router = express.Router();


const{capturedPayment,verifyPayment, sendPaymentSuccessEmail}  = require("../controllers/payment");

//-------------
     // const{capturedPayment,verifyPayment,sendPaymentSuccessEmail}  = require("../controllers/payment");
//-------------
const { auth, isAdmin, isInstructor, isStudent } = require('../middlewares/auth');

router.post('/capturePayment', auth, isStudent, capturedPayment);
router.post('/verifyPayment', auth, isStudent, verifyPayment);


//-----------------------------------------------
    router.post("/sendPaymentSuccessEmail",auth, isStudent, sendPaymentSuccessEmail);
//--------------------------------------- 

module.exports = router