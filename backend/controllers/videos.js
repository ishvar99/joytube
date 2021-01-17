const asyncHandler = require("../middlewares/asyncHandler")
const path =require('path')
// @desc    Upload Video
// @route   POST /api/v1/videos/upload
// @access  private
exports.uploadVideo = asyncHandler(async (req, res, next) => {
return res.json({success:true,filePath:req.file.path,fileName:req.file.filename});
})

