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



//Todo  Delete Section