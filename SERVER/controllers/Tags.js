const Tag = require("../models/Tags");


//handler function of create tag


exports.createTag = async(req,res)=>{
      try{
        //fetch data
        const {name,description} = new Tag(req.body);

        //validation of data
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All felids are required",
            })
        }

        //creating an entry in the db
        const  tagDetails = await  Tag.create({
              name:name,
              description:description,
        });
        console.log(tagDetails);


         //return  res 
         return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
         })

      }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
      }
}




// get all the tags
exports.showAllTags = async(req,res)=>{
    try{
        const allTags = await Tag.find({},{name:true, description:true});
        return res.status(200).json({
            success:true,
            message:'All tags returned Successfully',
            allTags
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
      }
}

