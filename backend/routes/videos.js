const express = require("express")
const {
  uploadVideo,
  generateThumbnail,
  submitVideo
} = require("../controllers/videos")
const { isLoggedin} = require("../middlewares/protect")
const S3upload =require("../middlewares/S3upload")
const router = express.Router()
// var storage = multer.memoryStorage({
//  destination: function (req, file, cb) {
//    cb(null, '')
//  },
//  filename: function (req, file, cb) {
//    cb(null, `${Date.now()}_${file.originalname}`)
//  },
// })
// const fileFilter = (req, file, cb) => {
//  if (file.mimetype == 'video/mp4') {
//      cb(null, true);
//  } else {
//      cb(null, false);
//  }
// }

// const upload = multer({ storage,fileFilter:fileFilter});
router.route("/upload").post(isLoggedin,S3upload,uploadVideo)
router.route("/thumbnail").post(isLoggedin,generateThumbnail)
router.route('/create').post(isLoggedin,submitVideo)
module.exports = router
