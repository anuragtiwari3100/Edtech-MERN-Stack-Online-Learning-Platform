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




exports.updateSection = async(req,res)=>{
    try{

        //data input
        const{sectionName,sectionId} = req.body;


        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields",
            })
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

    //TODO :- do we  need to delete entry from the course schema
        //return response
        return res.status(200).json({
            success: true,
             message:'Section Updated Successfully',
        });


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create  Section, please try again",
            error:error.message,
        })
    }
}



exports.deleteSection = async(req,res) =>{
    try{
        //get ID   - assuming that we are sending ID in params
        const{sectionId}  = req.params;


        //use findbyIdAndDeleteBy
        await Section.findByIDAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })

    }catch(error){

    }
}