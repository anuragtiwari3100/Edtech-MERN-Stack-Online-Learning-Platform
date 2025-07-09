const mongoose = require("mongoose")


const   courseProgressSchema = new mongoose.Schema({
     courseID :{
        type:mongoose.Schema.Types.ObjectId,
        ref :"Course",
     },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
     completedVideo :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",

        }
     ],
   //  hw. completedQuiz   and for  coding  problems platform integration  => suggestion of study materiial and many more 

})

module.exports = mongoose.model("CourseProgress",courseProgressSchema);