const express=require('express')
const router=express.Router();
const User=require('../models/user')
router.post('/register',(req,res)=>{
    const {firstname,lastname,email,password}=req.body;
    var user =new User({firstname,lastname,email,password});
    user.save(function(err,docs){
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
    User.findOne({email})
    .then((user)=>{
        if(user){
                user.comparePassword(password,user.password)
                .then((val)=>{
                        user.generateToken()
                        .then((docs)=>{
                            docs.password=undefined;
                        return res.json({loginSuccess:true,user:docs});
                        })
                        .catch(()=>{
                        return res.json({loginSuccess:false,authMessage:'Authentication Failed!'})
                        }) 
                })
                .catch((err)=>{
                    return res.json({loginSuccess:false,authMessage:'Authentication Failed!'})
                })
        }
        else
        return res.json({loginSuccess:false,authMessage:'Authentication Failed!'})
    })
})

module.exports=router;