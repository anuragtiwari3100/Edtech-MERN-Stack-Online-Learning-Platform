const Category = require('../models/category')

//handler function of create tag
exports.createCategory = async(req,res)=>{
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
            message: 'Category created successfully'
         })

      }catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}




// get all the tags
exports.showAllTags = async(req,res)=>{
    try {
        // get all category from DB
        const allCategories = await Category.find({}, { name: true, description: true });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }catch(error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}

