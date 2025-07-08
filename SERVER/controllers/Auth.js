const User = require("../models/User");
const Profile = require('./../models/profile');
const OTP = require("../models/OTP");
const optGenerator = require("otp-generator");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
require("dotenv").config();
const otpTemplate = require('../mail/templates/emailVerificationTemplate');
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const cookie = require('cookie');


//SenT_otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user already exists
    const checkUserPresent = await User.find({ email });


    //exist ->Yes
    if (checkUserPresent.length > 0) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    //exist -> No
    var otp = optGenerator.generate(6,{
         digits:true,
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })


    // console.log("OTP generated: "+otp);
       const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
      // console.log(name);

          // send otp in mail
        await mailSender(email, 'OTP Verification Email', otpTemplate(otp, name));


  

   // create an entry for otp in DB
        const otpBody = await OTP.create({ email, otp });
        // console.log('otpBody - ', otpBody)


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
        const   checkUserAlreadyExits = await User.findOne({email});
    if(checkUserAlreadyExits){
        return res.status(400).json({
             success:false,
                message:"User is already registered. Please log in .",

        })
    }

        //Step 4.find the most recent otp for the   user
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        // console.log("recent otp is "+recentOtp[0].otp); //bu mistake hamne find()  use kra tha jo ek array return karta hai usko access karne ke lie to hame uske index pe jo object store hai usko to access karna padega hi n
         console.log("otp is "+otp);
         console.log("otp resent is "+recentOtp.otp);

             // if otp not found
       if (!recentOtp || recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: 'Otp not found in DB, please try again'
            });
        } else if (otp !== recentOtp.otp) {
            // otp invalid
            return res.status(400).json({
                success: false,
                message: 'Invalid Otp'
            })
        }
          
        //Step 5.hash password
        const   hashedPassword = await bcrypt.hash(password,10);

        // additionDetails
const profileDetails =await  Profile.create({
    gender:null,
    dateOfBirth:null,
    about:null,
    contactNumber:null
});


   
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        // Step 6.create an entry in the db 
          const userData = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
            additionalDetails:profileDetails._id,
            approved:approved,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,


          })




        //Step 7.return response 
          return res.status(200).json({
            success:true,
            message: 'User is registered Successfully',
            userData:userData,
          })
    }catch(error){
         console.log('Error while registering user (signup)');
         console.log(error);
         return res.status(401).json({
          success:false,
          error: error.message,
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
        return res.status(400).json({
          success:false,
          message:"All fields are required , please try again",
      });
    }
      //step 3 check user exist or not
      let user = await User.findOne({email}).populate("additionalDetails");
       if(!user){
        return res.status(401).json({
          success:false,
          message:"User does not exist , please try again",
        });
       }
      //  console.log("password is "+password);
      //  console.log("user password is "+user.password);
      //step.4 Generate jwt token ,after  password matching 
      if(await bcrypt.compare(password,user.password)){

        const payload ={
          email : user.email,
          id :user._id,
          accountType:user.accountType// ye hame healp karega to check wather  user ke pass acces hai use route ke lie , while autherization
        }
        
            // Generate token
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn:"2h",
        });
         user = user.toObject();
        user.token = token;
        user.password = undefined; //hamen password object se remmove kia hai DB se nahi
      
      // step 5 create cookie and send the response

      const cookieOptions = {
        expires : new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly:true
      }

      res.cookie("token",token,cookieOptions).status(200).json({
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
    console.log('Error while Login user');
     console.log(error);
     return res.status(500).json({
      success:false,
      message:"Login Failure , Please try again",
   });
}
}



// //changePassword 
exports.changePassword = async (req, res) => {
    try {
        // extract data
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fileds are required'
            });
        }

        // get user
        const userDetails = await User.findById(req.user.id);

        // validate old passowrd entered correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

        // if old password not match 
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false, message: "Old password is Incorrect"
            });
        }

        // check both passwords are matched
        if (newPassword !== confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'The password and confirm password do not match'
            })
        }


        // hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update in DB
        const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
            { password: hashedPassword },
            { new: true });


        // send email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                'Password for your account has been updated',
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            // console.log("Email sent successfully:", emailResponse);
        }
        catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
            });
        }



        // return success response
        res.status(200).json({
            success: true,
            mesage: 'Password changed successfully'
        });
    }

    catch (error) {
        console.log('Error while changing passowrd');
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while changing passowrd'
        })
    }
}