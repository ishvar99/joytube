const express=require('express')
let app=express();
const PORT=5000;
require('./database/db');
const User=require('./models/user');
app.get('/',(req,res)=>{
    res.send("HOME PAGE");
})
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})