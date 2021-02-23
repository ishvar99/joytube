const mongoose=require('mongoose')
const videoSchema = new mongoose.Schema(
 {
   writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   title: {
     type: String,
     trim: true,
     required: [true, "Please provide a title"],
   },
   description: {
     type: String,
     required: [true, "Please provide a description"],
   },
   privacy: {
     type: Number,
     // 0 - Private
     // 1 - Public
   },
   filePath: {
     type: String,
   },
   category: {
    type: String,
  },
  views: {
   type: Number,
   default:0
 },
 duration:{
  type:String
 },
 thumbnail:{
  type:String
 }
 },
 { timestamps: true }
)

module.exports = mongoose.model("Video", videoSchema)