const mongoose = require("mongoose")
const querySchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    time:{
        type:Date,
        required:true,
        default:Date.now
    },
    message:{
        type:String,
        required:true,
    },
    requested:{
        type:String,
        required:false,
        default:""
    },
    resolved:{
        type:String,
        required:false,
        default:""
    },

})
module.exports  =mongoose.model("queries",querySchema)
