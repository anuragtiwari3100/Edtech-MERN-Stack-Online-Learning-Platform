 const User = require("../models/User");
 const mailSender = require("../utils/mailSender");
 const bcrypt = require('bcrypt');
//  const crypto = require('crypto');




//resetPasswordToken
exports.resetPasswordToken = async (req, res) =>{
    try{
        //Step 1 get email form req body
         const email = req.body;
        //step 2 check user for this emil , email validation
          const user = await  User.findOne({email:email});
          if(!user){
            return res.status(404).json({
                success:false,
                message:'Your Email is not  registered with us'
            });
          }
        //step3.generate token
        const token = crypto.randomUUID();
        // Step 4update user by adding tokje and expiration time 
       const updatedDetails = await User.findByIdAndUpdate({email:email},
                                                          {
                                                            token:token,
                                                            resetPasswordExpires: Date.now()+ 5*60*1000,
                                                          },
                                                          {new :true});
        // Step 5create url 
        const url = `http://localhost:3000/update-password/${token}`;

        // step 6 send  mail cnteing the url 
        await mailSender(email,"Password Reset Link",
            `Password Reset Link :${url}`
        );


        //Step 7 response
        return res.json({
               success:true,
               message:'Email sent successfully , please check password and try again'
        })
    }catch(error){
        console.log(error);
        return res.status(500),json({
            success:false,
            message:'Something went wrong while sending reset password email.'
        })

    }
}





//resetPass 
exports.resetPassword = async(req,res)=>{
   try{

     //data  fetch
    const {password , confirmPassword , token}  = req.body;
    //validation
    if(password != confirmPassword){
        return res.status(400).json({
          success:false,
          message:'Password and Confirm Password do not match'
    })
}
    //get userDetails from the db using token
    const userDetails = await User.findOne({token:token});
    //if  no entry - invalid token
      if(!userDetails){
        return res.status(400).json({
          success:false,
          message:'Invalid token',
      });
    }
    //token time check
    if(userDetails.resetPasswordExpires < Date.now()){      
        return res.json({
            success:false,
            message:'Token link has expired , please regenerate   your token ',
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
   }catch(error){
        console.log(error);
        return res.status(500),json({
            success:false,
            message:'Something went wrong while sending reset password email.'
        })

    }


}