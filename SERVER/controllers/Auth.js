const User = require("../models/User");
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
const { Profiler } = require("react");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
require("dotenv").config();



//SenT_otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user already exists
    const checkUserPresent = await User.find({ email });

    //exist ->Yes
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    //exist -> No
    var otp = optGenerator.generate(6,{
        upperCaseAlphabet:false,
        lowerCaseALphabet:false,
        specialChars:false,
    })

    console.log("OTP generated: "+otp);

   //Check weather the otp is Unique or not
   const result = await otp.findOne({otp:otp});
   while(result){
    otp =optGenerator.generate(6,{   //chnage here
        upperCaseAlphabet:false,
        lowerCaseALphabet:false,
        specialChars:false, 
    })
    result = await OTP.findOne({otp:otp});
   }
 

   const  otpPayload = {email,otp}; 

   //creating an  entry into the database for the otp
   const optBody  = await OTP.create(otpPayload);
   console.log(otpPayload);

   //return response successful
    res.status(200).json({
        success:true,
        message:"OTP Sent Successfully",

    })


  } catch (error) {
       console.log(error);
       return res.status(500).json({
        success:false,
        message:error.message
       })

  }
};



//SignUp
exports.signUp = async(req,res) =>{
    try{

        //step1.data fetch from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } =req.body;

    
        //Step2.  Validate the password
         if(!firstName || !email || !password || !confirmPassword || !otp){
               return res.status(403).json({
                 success:false,
                 message:"All fields are required",
               })
         }

        
        //Step.3  Match  Those 2 pass 
            if(password != confirmPassword){
                  return res.status(400).json({
                    success:false,
                   message: "Passwords don’t match. Please double-check and try again."
                  });
            }


     


        //Step.3. check user already exists or not
        const   existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
             success:false,
                message:"User is already registered. Please log in instead.",

        })
    }

        //Step 4.find the most recent otp for the   user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
         console.log(recentOtp);


           if(recentOtp.length == 0){

             //Simple - otp  is not found
            return res.status(400).json({
            success:false,
            message: "Oops! We couldn’t find an OTP. Try again in a moment."
           });
        }
        

        //Step 4.validate otp
           else if(otp !==  recentOtp.otp){
              //OTP inVAlid  hai  
              return res.status(400).json({
                success:false,
                message: "Invalid OTP. Please try again.",
              })

           }
          
        //Step 5.hash password
        const   hashedPassword = await bcrypt.hash(password,10);


const profileDetails =await  Profile.create({
    gender:null,
    dateOfBirth:null,
    about:null,
    contactNumber:null
});

        // Step 6.create an entry in the db 
          const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,


          })




        //Step 7.return response 
          return res.status(200).json({
            success:true,
            message: 'User is registered Successfully',
            user
          })
    }catch(error){
         console.log(error);
         return res.status(500).json({
          success:false,
          message:"User cannot be registered . Please try again",
         })
    }
}


//Login
exports.login =  async(req,res) =>{
   try{ 

      // Step 1.get the Data from request body
      const {email,password} = req.body;

      // step 2 .Validation of Data
      if(!email || !password){
        return res.status(403).json({
          success:false,
          message:"All fields are required , please try again",
      });
    }
      //step 3 check user exist or not
      const user = await User.findOne({email}).populate("additionalDetails");
       if(!user){
        return res.status(401).json({
          success:false,
          message:"User does not exist , please try again",
        });
       }
      //step.4 Generate jwt token ,after  password matching 
      if(await bcrypt.compare(password,user.password)){

        const payload ={
          email : user.email,
          id :user._id,
          role : user.accountType,
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn:"2h",
        });
        user.token = token;
        user.password = undefined;
      
      // step 5 create cookie and send the response

      const options = {
        expires : new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly:true
      }

      res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
        message:"User logged in successfully",
      })
    }
    else{
      return res.status(401).json({
        success:false,
        message:"Password is incorrect"
      })
    }

     
   }catch(error){
     console.log(error);
     return res.status(500).json({
      success:false,
      message:"Login Failure , Please try again",
   });
}
}



//changePassword 
exports.changePassword =  async(req,res)=>{
     try{
        //Step 2 get oldPassWord , new password , confirmNew pass

    const {oldPassword , newPassword , confirmPassword}  = req.body;

      //Step.3 Validation
    if(!oldPassword || !newPassword || !confirmPassword){
      return res.status(403).json({
        success:false,
        message:'All fields are required'
      })
    }


     //get the user
     const userDetails = await User.findById(req.user.id);

     //validate old password entered correct or not
     const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
     )

     //if old password does not matched 
     if(!isPasswordMatch){
      return res.status(401).json({
        success:false,
        message:"Old  password is Incorrect"
      });
     }


     //check if both  the password matched
     if(newPassword !== confirmPassword){
           return res.status(403).json({
                success: false,
                message: 'The password and confirm password do not match'
            })
    }

    //hash password 
    const hashedPassword = await bcrypt.hash(newPassword,10);

    //update in DB
    const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
      {password:hashedPassword},
      {new:true}
    );

    //send  email
    try{
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        'Password for your account has been updated',
        password    ///problem here
      )
    } catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }


            // return success response
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
     } catch (error) {
        console.log('Error while changing passowrd');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            messgae: 'Error while changing passowrd'
        })
    }
 

}

