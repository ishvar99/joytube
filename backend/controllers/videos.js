const asyncHandler = require("../middlewares/asyncHandler")
const path =require('path')
const Video =require('../models/video.js');
const ffmpeg=require('fluent-ffmpeg')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
const creds = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, sessionToken: process.env.AWS_SESSION_TOKEN
});
const s3 =new AWS.S3({
  credentials:creds
})
// @desc    Upload Video
// @route   POST /api/v1/videos/upload
// @access  private
exports.uploadVideo = asyncHandler(async (req, res, next) => {
  console.log(req.file);
  let uploadfile= req.file.originalname;
  let extension = req.file.mimetype.split('/')[1];
  const params={
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuidv4()}.${extension}`,
    Body: req.file.buffer
  }
  s3.upload(params, (err,data)=>{
    if(err){
      console.log(err);
    }
    else {
      console.log(data);
    }
  })
  console.log(req.file)
//  if(req.file)
// return res.json({success:true,filePath:req.file.path,fileName:req.file.filename});
// else
// return res.json({success:false});
})

exports.generateThumbnail= asyncHandler(async (req, res, next) => {
 let {filePath,fileName}=req.body;
 let thumbnailPath="";
 let videoDuration="";
 ffmpeg.ffprobe(filePath,(err,metadata)=>{
  if(!err){
   videoDuration=metadata.format.duration;
  }
 });
 ffmpeg(filePath)
  .on('filenames', function(filenames) {
    console.log('Will generate ' + filenames.join(', '))
    thumbnailPath=`uploads/thumbnails/${filenames[0]}`;
  })
  .on('end', function() {
    console.log('Screenshots taken');
    res.json({success:true,thumbnailPath,videoDuration})
  })
  .screenshots({
    // Will take screens at 20%, 40%, 60% and 80% of the video
    count: 1,
    folder: 'uploads/thumbnails/',
    size:'320x240',
    filename:'thumbnail-%b.png'
  })
})
exports.submitVideo=asyncHandler(async (req,res,next)=>{
  const video=await Video.create(req.body);
  if(video){
    return res.status(200).json({'success':true,'message':'Video created successfully'});
  }
  else{
    return next(new ErrorResponse("Failed to create video", 400))
  }
})