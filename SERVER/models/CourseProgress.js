const mongoose = require("mongoose")


const   courseProgressSchema = new mongoose.Schema({
     courseID :{
        type:mongoose.Schema.Types.ObjectId,
        ref :"Course",
     },
     completedVideo :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",

        }
     ],
   //  hw. completedQuiz   and for  coding  problems platform integration

})

module.exports = ("CourseProgressSchema",courseProgressSchema);