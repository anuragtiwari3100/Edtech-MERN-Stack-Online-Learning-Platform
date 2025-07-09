const express = require("express");
const router = express.Router();


const{capturedPayment,verifyPayment}  = require("../controllers/payment");
const { auth, isAdmin, isInstructor, isStudent } = require('../middlewares/auth');

router.post('/capturePayment', auth, isStudent, capturedPayment);
router.post('/verifyPayment', auth, isStudent, verifyPayment);

module.exports = router