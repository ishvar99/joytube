require('dotenv').config()
const express=require('express')
const path =require('path')
const cookieParser = require('cookie-parser')
let app=express();
app.use(cookieParser())

const PORT=process.env.PORT||5000;
require('./database/db');
const userRoutes=require('./routes/user');
app.use(express.json());
app.use('/api/user',userRoutes);
// if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname, "../client", "build")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
    });
    // }
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})