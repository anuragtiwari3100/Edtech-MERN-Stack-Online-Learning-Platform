const mongoose  = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
     email:{
        type:String,
        required :true,
     },
     otp:{
        type:String,
        required:true
     },
     createdAt:{
        type:Date,
        default:Date.now(), 
        expires: 5*60,
     }
})


// function -> for sending email
 async  function  sendVerificationEmail(email,otp){
     try{
          
      const mailResponse  = await mailSender(email,"Verification Email from: BrightEdge | CodeCrafters • Your Learning Partner",otp);
      console.log("Email  sent Successfully",mailResponse);
     }catch(error){
        console.log("Error occurre while sending email"+error);
         throw error;
     }
 }


 OTPSchema.pre("save", async function(next){
    
   await sendVerificationEmail(this.email,this.otp);
   next();
 })


 

module.exports = ("OTP",OTPSchema);