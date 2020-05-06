const {data:{jwt_secret}}=require('../config/keys')
const User=require('../models/user')
exports.isLoggedIn=(req,res,next)=>{
    let token=req.cookies.x_auth;
    console.log(token)
    User.findByToken(token)
    .then((user)=>{
        req.user=user;
        req.token=token;  
        next();     
    })
    .catch((err)=>{
        return res.status(401).json({isAuthenticated:false})
    })
}