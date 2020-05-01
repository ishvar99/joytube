const mongoose =require('mongoose');
const {mongoURI}=require('../config/keys')
mongoose.connect(mongoURI,{useNewUrlParser:true, useUnifiedTopology: true })
.then(()=>{
    console.log('Connected to Database!')
})
.catch((err)=>{
    console.log('Something went wrong!',err)
})
