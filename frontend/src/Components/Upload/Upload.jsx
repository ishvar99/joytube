import React,{useState} from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import {Form,Button,Row,Col,Container} from 'react-bootstrap'
import Backdrop from '../Backdrop/Backdrop'
import Progress from '../ProgressBar/ProgressBar'
const Upload = () => {
 const Privacy = [
  { value: 0, label:'Public'},
  { value: 1, label:'Private'}
]

const Category = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" },
]
const [video, setVideo] = useState("");
const [title, setTitle] = useState("");
const [uploading, setUploading] = useState(false);
const [description,setDescription]=useState("");
const [privacy, setPrivacy] = useState(Privacy[0].label);
const [category, setCategory] = useState(Category[0].label);
const [thumbnail, setThumbnail] = useState("");
const [duration, setDuration]=useState("")
const [progressCounter,setProgressCounter]=useState(0);
const cancleUpload=()=>{
  setUploading(false);
}
const uploadFile=async (files)=>{
  setThumbnail("");
 console.log('upload triggered')
 let formData=new FormData();
 formData.append('file',files[0]);
 console.log(files[0])
 setUploading(true);
 var config = {
  onUploadProgress: function(progressEvent) {
    console.log(Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
    setProgressCounter(Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
  }
}
 const response= await axios.post('/api/v1/videos/upload',formData,config);
 if(response.data.success){
  var filePath=response.data.filePath;
  var fileName=response.data.fileName
  setVideo(response.data.filePath);
  //Generate Thumbnail
  const resp= await axios.post('/api/v1/videos/thumbnail',{filePath,fileName},{"Content-Type":"application/json"})
  if(resp.data.success){
    setUploading(false);
   let {thumbnailPath,videoDuration}=resp.data;
   console.log(thumbnailPath);
   setThumbnail(thumbnailPath);
   setDuration(videoDuration);
  }
  else{
    setUploading(false);
   alert('Failed to generate thumbnail')
  }
 }
 else{
  setUploading(false);
  alert('Failed to upload file')
 }
}
const handleFormSubmit=(e)=>{
 e.preventDefault();
 console.log(title)
 console.log(description)
 console.log(privacy)
 console.log(category)
}
 return (
  <>
  <Container style={{marginTop:'15vh', marginBottom:'15vh',padding:"0 15vw"}}>
  <Form noValidate onSubmit={handleFormSubmit}>
  <h2 className="text-center pb-5">
   Upload Video
  </h2>
  <Form.Group>
  <div class='d-flex justify-content-between flex-wrap'>
  <Dropzone accept="video/mp4" multiple={false} maxSize={800000000} onDrop={uploading?null:uploadFile}>
  {({getRootProps, getInputProps}) => (

    <div {...getRootProps()} style={{outline:"none", width:"260px",height:"240px",border:"1px solid lightgray", display: 'flex', alignItems: 'center', justifyContent: 'center',marginBottom:"50px"}}>
    <input  {...getInputProps()} />
  <i style={{fontSize:"32px",color:'#ff0038'}} class="fas fa-plus"></i>
  </div>
  )}
</Dropzone>
{uploading?
  (<div style={{display: "flex",flexDirection:"column" ,justifyContent: "center",alignItems: "center",width:"260px",height:"240px"}}>
    <p style={{textAlign:"center"}}>{progressCounter>90?"Generating Thumbnail...":"Processing Video..."}</p>
  <Progress done={progressCounter}/>
  <div style={{display: "flex","justify-content": "center","align-items": "center"}}>
  <button onclick={cancleUpload} style={{borderRadius:"5px", border:"none",margin:"20px 0",width: "70px" ,padding:"3px",background:"#FF0038",color:"white"}}>Cancle</button> 
  </div>
  </div>):null
}
{
  thumbnail!=""?(
    <Form.Group>
      <img style={{height:"240px",width:"260px"}} src={`/${thumbnail}`} alt="Error"/></Form.Group>)
     :null
}
     </div>
  </Form.Group>
          <Form.Group style={{padding:"20px 0"}}>
            <Form.Label>Title</Form.Label>
            <Form.Control
            required={true} 
              type="text"
              name="title"
              onChange={(e)=>setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group style={{padding:"20px 0"}}>
            <Form.Label>Description</Form.Label>
            <Form.Control required={true} onChange={(e)=>setDescription(e.target.value)} name="description"  type="text" as="textarea" rows={3} />
          </Form.Group>
          <Form.Group style={{padding:"20px 0"}}>
    <Form.Label>Privacy</Form.Label>
    <Form.Control  onChange={(e)=>setPrivacy(e.target.value)} style={{width:"50%"}} as="select">
    {Privacy.map((e,i)=><option key={i}>{e.label}</option>)}
    </Form.Control>
  </Form.Group>
  <Form.Group style={{padding:"20px 0"}}>
    <Form.Label>Genre</Form.Label>
    <Form.Control  onChange={(e)=>setCategory(e.target.value)} style={{width:"50%"}} as="select">
    {Category.map((e,i)=><option key={i}>{e.label}</option>)}
    </Form.Control>
  </Form.Group>
          <div className="mx-auto text-center">
          <button className='btn w-25' style={{background:'#ff0038',color:'white',textAlign:'center',padding:'10px 0'}} type="submit">
            Upload
          </button>
          </div>
      </Form>
  </Container>
  </>
 )
}

export default Upload
