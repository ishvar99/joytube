const multiparty = require('multiparty')
const fs =require('fs')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
const creds = new AWS.Credentials({
 accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, sessionToken: process.env.AWS_SESSION_TOKEN
});
const s3 =new AWS.S3({
 credentials:creds
})
const S3upload  = (req,res,next)=>{
var form = new multiparty.Form();
 form.parse(req, function(err, fields, files) {
  console.log(fields)
  console.log(files.file[0].headers)
let extension = files.file[0].originalFilename.split('.')[1];
const params={
  Bucket: process.env.BUCKET_NAME,
  Key: `videos/${uuidv4()}.${extension}`,
  Body: fs.readFileSync(files.file[0].path)
}

s3.upload(params, (err,data)=>{
 if(err){
   console.log(err);
   next();
 }
 else 
   req.file=data;
   next();
}) 
});

 }
module.exports=S3upload;
  