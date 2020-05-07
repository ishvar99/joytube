require('dotenv').config()
const express=require('express')
const cookieParser = require('cookie-parser')
let app=express();
app.use(cookieParser())
const PORT=process.env.PORT||5000;
require('./database/db');
const userRoutes=require('./routes/user');
app.use(express.json());
app.get('/',(req,res)=>{
    res.json({message:'JoyTube: A clone of YouTube'})
})
app.use('/api/user',userRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})