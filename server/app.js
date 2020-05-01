require('dotenv').config()
const express=require('express')
let app=express();
const PORT=5000;
require('./database/db');
const userRoutes=require('./routes/user');
app.use(express.json());
app.use('/api/user',userRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})