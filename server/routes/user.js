const express=require('express')
const router=express.Router();
const User=require('../models/user')
const {isLoggedIn} =require('../middleware/auth')
router.get('/auth',isLoggedIn,(req,res)=>{
    const user=req.user;
    res.json({name:`${user.firstname} ${user.lastname}`,email:user.email,role:user.role,token:user.token});
})
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
                        return res.cookie('x_auth',docs.token).status(200).json({loginSuccess:true,user:docs});
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
router.get('/logout',isLoggedIn,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{token:""},function(err,docs){
        if(docs)
            return res.json({success:true})
        return res.json({success:false})
    })
})
module.exports=router;