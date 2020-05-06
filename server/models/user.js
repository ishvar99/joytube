const mongoose=require('mongoose')
const {isEmail} = require('validator');
const {data:{jwt_secret}}=require('../config/keys')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
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
userSchema.methods.comparePassword=function(plainPassword,hashedPassword){
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainPassword, hashedPassword, function(err,result) {
            if(result)
            return resolve(result)
            else
            return reject(err)
    })
    });
}
userSchema.methods.generateToken=function(){
    var user=this;
    var token =jwt.sign({ id: user._id},jwt_secret);
    user.token=token;
    console.log(token);
    return new Promise((resolve,reject)=>{
        user.save(function(err,user){
            if(!err){
            return resolve(user)
            }
            else
            return reject(err)
        });
    })
    
}

module.exports=mongoose.model('User',userSchema);