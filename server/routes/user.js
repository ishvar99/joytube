const express=require('express')
const router=express.Router();
const User=require('../models/user')
router.post('/register',(req,res)=>{
    const {firstname,lastname,email,password}=req.body;
    var user =new User({firstname,lastname,email,password});
    user.save((err,docs)=>{
        console.log(docs)
        if(err)
           return res.json({success:false,err})
        return res.status(200).json({
            success:true,
            userData:docs
        })
    })
})
router.post('/login',(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password)
    User.findOne({email}).then((user)=>{
        if(user){
           if(user.comparePassword(password,user.password)){
               console.log('Valid Email')
               return Promise(resolve(user));
           }
           else{ 
               console.log('Invalid Email')
               return Promise(reject({loginSuccess:'false',authMessage:'Authentication Failed!'}))
            }
        }
        else
        return res.json({loginSuccess:false,authMessage:'Authentication Failed!'})
    }).then((user)=>{
        user.generateToken()
        .then(()=>{
            return res.json({loginSuccess:true,user});
        })
        .catch(()=>{
            return res.json({loginSuccess:false,authMessage:'Authentication Failed!'})
        })
    }).catch((error)=>{
        return res.json(error);
    })
})

module.exports=router;