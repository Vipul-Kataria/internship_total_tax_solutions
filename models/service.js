const mongoose = require('mongoose');
const Admin=require("./admin")
const { Schema } = mongoose; 
const serviceSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"Admin"
    }
})

module.exports=mongoose.model("Service",serviceSchema);