const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res)=>{
    try{

        //data fetch
       const{sectionName,courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            });
        }
        
        //create section
        const  newSection = await  Section.create({sectionName});

        //update course with section objectId
       const updatedCourseDetails = await Course.findByIdAndUpdate(
             courseId,
             {
                $push:{
                   courseContent:newSection._id,
                }
             },
             {new:true}
       );
       //HW :use populate to replace section sub section in the udated course details

        //return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create  Section, please try again",
            error:error.message,
        })
    }
}




exports.updateSection = async (req, res) => {
    try {
        // extract data
        const { sectionName, sectionId, courseId } = req.body;

        // validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // update section name in DB
        await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data:updatedCourseDetails,
            message: 'Section updated successfully'
        });
    }
    catch (error) {
        console.log('Error while updating section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while updating section'
        })
    }
}



exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        // console.log('sectionId = ', sectionId);

        // delete section by id from DB
        await Section.findByIdAndDelete(sectionId);

        const updatedCourseDetails = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                }
            })

        res.status(200).json({
            success: true,
            data: updatedCourseDetails,
            message: 'Section deleted successfully'
        })
    }
    catch (error) {
        console.log('Error while deleting section');
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while deleting section'
        })
    }
}