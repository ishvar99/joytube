const asyncHandler = require("../middlewares/asyncHandler")
const path =require('path')
const Video =require('../models/video.js');
const ffmpeg=require('fluent-ffmpeg')

// @desc    Upload Video
// @route   POST /api/v1/videos/upload
// @access  private
exports.uploadVideo = asyncHandler(async (req, res, next) => {
  if(!req.file)
  return res.json({success:false});
  return res.json({success:true,filePath:req.file.Location,fileName:req.file.Key});
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