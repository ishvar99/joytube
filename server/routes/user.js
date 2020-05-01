const express=require('express')
const router=express.Router();
const User=require('../models/user')
router.post('/register',(req,res)=>{
    const {firstname,lastname,email,password}=req.body;
    User.create({
        firstname,lastname,email,password
    }).then((user)=>{
        res.status(200).json({message:'success',user})
    }).catch(()=>{
        res.json({error:'Something went wrong!'})
    })
})

module.exports=router;