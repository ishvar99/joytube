const asyncHandler = require("../middlewares/asyncHandler")
const path =require('path')
const ffmpeg=require('fluent-ffmpeg')
// @desc    Upload Video
// @route   POST /api/v1/videos/upload
// @access  private
exports.uploadVideo = asyncHandler(async (req, res, next) => {
  console.log(req.file)
 if(req.file)
return res.json({success:true,filePath:req.file.path,fileName:req.file.filename});
else
return res.json({success:false});
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