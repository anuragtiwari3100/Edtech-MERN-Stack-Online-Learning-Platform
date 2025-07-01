const Section = require("../models/Section");
const Subsection = require("../models/Section");
const Subsection = require("../models/SubSection");



//create SubSection
exports.createSubSection = async (req, res) =>{
    try{

        //fetch data from Req body
   const {sectionId,title, timeDuration,description } = req.body;

        //extract file/video
        const video = req.files.videoFile;

        //validation
        if(!sectionId || !title ||!timeDuration || !description ||!video){
            return res.status(400).json({
                success:false,
                message:'All felids are required',
                
            })
        }
        //upload video  to cloudinary
        const uploadDetails  = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create a sub section
        const SubSectionDetails = await Subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,

        })
        //update section with this sub section ObjectId

        const updatedSection = await Section.findByIdAndUpdate( {_id:sectionId},
            
                {$push:{
                    subSections:SubSectionDetails._id
                }},
                {new:true});
             //TODO:- log updated section here after adding populate query

          


            
            
         //return response
         return res.status(200).json({
            success:true,
            message:'Sub Section created successfully',
            updatedSection,
         });



    }catch(error){
       return res.status(500).json({
        success:false,
        message:"Internal Server Error",
        error:error.message
       })
        
    }
}



//Todo  Update Section 
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;

        // validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'subSection ID is required to update'
            });
        }

        // find in DB
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        // add data
        if (title) {
            subSection.title = title;
        }

        if (description) {
            subSection.description = description;
        }

        // upload video to cloudinary
        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = uploadDetails.duration;
        }

        // save data to DB
        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success: true,
            data: updatedSection,
            message: "Section updated successfully",
        });
    }
    catch (error) {
        console.error('Error while updating the section')
        console.error(error)
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating the section",
        })
    }
}



//Todo  Delete Section
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )

        // delete from DB
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        const updatedSection = await Section.findById(sectionId).populate('subSection')

        // In frontned we have to take care - when subsection is deleted we are sending ,
        // only section data not full course details as we do in others 

        // success response
        return res.json({
            success: true,
            data: updatedSection,
            message: "SubSection deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,

            error: error.message,
            message: "An error occurred while deleting the SubSection",
        })
    }
}