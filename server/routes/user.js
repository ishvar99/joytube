const express=require('express')
const bcrypt = require('bcryptjs');
const router=express.Router();
const User=require('../models/user')
router.post('/register',(req,res)=>{
    const {firstname,lastname,email,password}=req.body;
    var user =new User({firstname,lastname,email,password});
    user.save((err,docs)=>{
        if(err)
            res.json({success:false,err})
        res.status(200).json({
            success:true,
            userData:docs
        })
    })
})

module.exports=router;