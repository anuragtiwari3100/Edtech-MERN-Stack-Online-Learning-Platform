const mongoose =  require('mongoose');
require("dotenv").config();

exports.connect = ()  =>{
     mongoose.connect(process.env.MONGODB_URl,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
     })
     .then(()=>{console.log("Connected with Data base Successfully ✅✅✅  😎")})
     .catch((error)=>{
      console.log("Db  Connection Failed");
     console.error(error);
     process.exit(1);
     });
}  

  