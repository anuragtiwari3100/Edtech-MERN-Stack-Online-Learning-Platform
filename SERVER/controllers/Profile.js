 const Profile = require("../models/Profile");
const  User = require("../models/User");
 
exports.updateProfile =  async(req,res)=>{

    try{

        //get the data
    const {dateOfBirth="",about="",contactNumber,gender} =req.body;
        //get userID
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        
        //find  profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);


        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success:true,
            message:'Profile updated Successfully',
            profileDetails,
        })

    }catch(error){
     return res.status(400).json({
        success:false,
        message:error.message
     })

    }

}

//to can we schedule the business logic of thhis hanlder untion
//delete Account
exports.deleteAccount = async (req, res) => {
    try {
        // extract user id
        const userId = req.user.id;
        // console.log('userId = ', userId)

        // validation
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // delete user profile picture From Cloudinary
        await deleteResourceFromCloudinary(userDetails.image);

        const userEnrolledCoursesId = userDetails.courses
        console.log('userEnrolledCourses ids = ', userEnrolledCoursesId)

        for (const courseId of userEnrolledCoursesId) {
            await Course.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: userId }
            })
        }

        // first - delete profie (profileDetails)
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // second - delete account
        await User.findByIdAndDelete(userId);


        // sheduale this deleting account , crone job

        // return response
        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        })
    }
    catch (error) {
        console.log('Error while updating profile');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting profile'
        })
    }
}


//  get details of user
exports.getUserDetails = async (req, res) => {
    try {
        // extract userId
        const userId = req.user.id;
        console.log('id - ', userId);

        // get user details
        const userDetails = await User.findById(userId).populate('additionalDetails').exec();

        // return response
        res.status(200).json({
            success: true,
            data: userDetails,
            message: 'User data fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching user details');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while fetching user details'
        })
    }
}



exports.getAllUserDetails =  async(req,res)=>{
    try{
    //get the id
    const id = req.user.id;

    //validation and get user details
    const userDetails = await User.findById(id).populate("additionalDetails").exec();
    //return response
    return res.status(200).json({
        success:true,
        message:"User Details Retrieved Successfully",
    });
        

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error Occured while fetching user details",
        });
    }
}