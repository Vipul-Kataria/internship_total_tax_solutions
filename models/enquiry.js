const mongoose = require('mongoose');
const { Schema } = mongoose; 
const enquirySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    message:{
        type:String,
    },
    
})

module.exports=mongoose.model("Enquiry",enquirySchema);