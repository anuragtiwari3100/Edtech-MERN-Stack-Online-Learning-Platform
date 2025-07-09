 const User = require("../models/User");
 const mailSender = require("../utils/mailSender");
 const bcrypt = require('bcrypt');
 const crypto = require('crypto');




//resetPasswordToken
exports.resetPasswordToken = async (req, res) =>{
    try{
        //Step 1 get email form req body
         const {email} = req.body;

        //step 2 check user for this emil , email validation
          const user = await  User.findOne({email});
          if(!user){
            return res.status(404).json({
                success:false,
                message:'Your Email is not  registered with us'
            });
          }
        //step3.generate token
        const token = crypto.randomBytes(20).toString("hex");

        // Step 4update user by adding tokje and expiration time 
       const updatedDetails = await User.findOneAndUpdate({email:email},
                                                          {
                                                            token:token,
                                                            resetPasswordExpires: Date.now()+ 5*60*1000,
                                                          },
                                                          {new :true});//true maek kar dene se ab ye naye user ki entry retun karega
        // Step 5create url 
        const url = `http://localhost:3000/update-password/${token}`;

        // step 6 send  mail cnteing the url 
        await mailSender(email,"Password Reset Link",
            `Password Reset Link :${url}`
        );


        //Step 7 response
         res.status(200).json({
               success:true,
               message:'Email sent successfully , please check password and try again'
        })
    }catch (error) {
        console.log('Error while creating token for reset password');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while creating token for reset password'
        })
    }
}







//resetPass 
exports.resetPassword = async(req,res)=>{
   try{
// extract data
        // extract token by anyone from this 3 ways
        const token = req.body?.token || req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
     //data  fetch
    const {password , confirmPassword }  = req.body;

           // validation
        if (!token || !password || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "All fiels are required...!"
            });
        }

   // validate both passwords
    if(password != confirmPassword){
        return res.status(400).json({
          success:false,
          message:'Password and Confirm Password do not match'
    })
}
    //get userDetails from the db using token
    const userDetails = await User.findOne({token:token});

            // check ==> is this needed or not ==> for security  
        if (token !== userDetails.token) {
            return res.status(401).json({
                success: false,
                message: 'Password Reset token is not matched'
            });
        }

         // console.log('userDetails.resetPasswordExpires = ', userDetails.resetPasswordExpires);
       
         //-----------------
    //if  no entry - invalid token
      if(!userDetails){
        return res.status(400).json({
          success:false,
          message:'Invalid token',
      });
    }
    //------------------

                 // check token is expire or not
        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(401).json({
                success: false,
                message: 'Token is expired, please regenerate token'
            });
        }


    //hash Password
    const hashedPassword = await bcrypt.hash(password,10);
    //update  with new password
    const updatedUser = await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );
    //return response
      return res.status(200).json({
        success:true,
        message:'Password reset successfully',
      })
   }
    catch (error) {
        console.log('Error while reseting password');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while reseting password12'
        });
    }


}