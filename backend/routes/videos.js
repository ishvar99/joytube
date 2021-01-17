const express = require("express")
const multer=require('multer')
const {
  uploadVideo,
  generateThumbnail
} = require("../controllers/videos")
const { isLoggedin } = require("../middlewares/protect")
const router = express.Router()
var storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads/videos/')
 },
 filename: function (req, file, cb) {
   cb(null, `${Date.now()}_${file.originalname}`)
 },
})
const fileFilter = (req, file, cb) => {
 if (file.mimetype == 'video/mp4') {
     cb(null, true);
 } else {
     cb(null, false);
 }
}

const upload = multer({ storage,fileFilter:fileFilter});
router.route("/upload").post(isLoggedin,upload.single('file'),uploadVideo)
router.route("/thumbnail").post(isLoggedin,generateThumbnail)
module.exports = router
