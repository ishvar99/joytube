const mongoose=require('mongoose')
var {isEmail} = require('validator');
var bcrypt = require('bcryptjs');
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
userSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err)
    bcrypt.hash(user.password,salt, function(err, hash) {
        if(!err){
            user.password=hash;
            next();
        }
          
        else return next(err);
    });
});
    }
    else{
        next();
    }
})
module.exports=mongoose.model('User',userSchema);