const mongoose=require('mongoose')
var {isEmail} = require('validator');

const userSchema =new mongoose.Schema({
    firstname:{
        type:String,
        maxlength:50,
        required:true
    },
    lastname:{
        type:String,
        maxlength:50,
        required:true
    },
    email:{
        type:String,
        validate:{
            validator:(value)=>isEmail(value)
        },
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:5,
        required:true
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    },
    tokenExpiry:{
        type:String
    }

})

module.exports=mongoose.model('User',userSchema);