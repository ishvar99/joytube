import React,{useState,useRef,useEffect} from 'react'
import {useSelector} from 'react-redux'
import Dropzone from 'react-dropzone'
import axios,{CancelToken,isCancel} from 'axios'
import {Form,Container} from 'react-bootstrap'
import {ProgressBar} from 'react-bootstrap'
const Upload = (props) => {
const auth= useSelector(state => state.auth);

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
const [input,setInput] = useState({title:"",description:""});
const [uploading, setUploading] = useState(false);
const [privacy, setPrivacy] = useState(Privacy[0].value);
const [category, setCategory] = useState(Category[0].label);
const [thumbnail, setThumbnail] = useState("");
const [duration, setDuration]=useState("")
const [uploadPercentage,setUploadPercentage]=useState(0);
const [active,setActive]=useState(false);
const cancelFileUpload = useRef(null)
const handleFormSubmit= async (e)=>{
  e.preventDefault();
  const videoData={
    writer:auth.user._id,
    title:input.title,
    description:input.description,
    privacy,
    filePath:video,
    category,
    duration,
    thumbnail,
  };
  try{
  const response = await axios.post('/api/v1/videos/create',videoData);
    if(response.data.success){
      props.history.push('/');
    }
    else{
      alert('Failed to create video')
    }
  }catch(err){
    alert('Failed to create video');
  }
}
useEffect(() => {
  if(input.title!=="" && input.description!=="" && thumbnail!=="" && video!==""){
    setActive(true);
  }
  else{
    setActive(false);
  }
}, [input,video,thumbnail]);
const uploadFile=async (files)=>{
  setThumbnail("");
 console.log('upload triggered')
 let formData=new FormData();
 formData.append('file',files[0]);
 console.log(files[0])

 setUploading(true);
 var config = {
  onUploadProgress: function(progressEvent) {
    setUploadPercentage(Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
  },
  cancleToken:new CancelToken(cancel=>cancelFileUpload.current=cancel)
}
try{
 const response= await axios.post('/api/v1/videos/upload',formData,config);
 setUploadPercentage(100);
 setTimeout(()=>{
  setUploadPercentage(0);
 },1000)
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
}catch(err){
  if(isCancel(err)){
    alert(err.message)
  }
  else{
  alert('Failed to upload file');
  }
}
}
const handleFieldChange=(e)=>{
  const {name,value}=e.target;
  setInput({...input,[name]:value});
}
const cancelUpload=()=>{
  if(cancelFileUpload.current){
    cancelFileUpload.current('Video upload has been canceled!')
  }
}
 return (
  <>
  <Container style={{marginTop:'15vh', marginBottom:'15vh',padding:"0 15vw"}}>
  <Form noValidate onSubmit={handleFormSubmit}>
  <h2 className="text-center pb-5">
   Upload Video
  </h2>
  <Form.Group>
  <div className='d-flex justify-content-between flex-wrap'>
  <Dropzone noClick={uploading} noDrag={uploading} accept="video/mp4" multiple={false} maxSize={800000000} onDrop={uploadFile}>
  {({getRootProps, getInputProps}) => (

    <div {...getRootProps()} style={{outline:"none", width:"260px",height:"240px",border:"1px solid lightgray", display: 'flex', alignItems: 'center', justifyContent: 'center',marginBottom:"50px"}}>
    <input  {...getInputProps()} />
  <i style={{fontSize:"32px",color:'#ff0038'}} className="fas fa-plus"></i>
  </div>
  )}
</Dropzone>
{uploadPercentage>0&&
  (<div className='progress-container'>
    <p>{uploadPercentage>98?"Generating Thumbnail...":"Processing Video..."}</p>
    <ProgressBar animated now={uploadPercentage} label={`${uploadPercentage}%`}/>
  <div className='cancel-container'>
  <button onclick={cancelUpload}>Cancel</button> 
  </div>
  </div>)
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
              onChange={handleFieldChange}
            />
          </Form.Group>

          <Form.Group style={{padding:"20px 0"}}>
            <Form.Label>Description</Form.Label>
            <Form.Control required={true} onChange={handleFieldChange} name="description"  type="text" as="textarea" rows={3} />
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
          <button disabled={!active} className='btn w-25' style={{background:'#ff0038',color:'white',textAlign:'center',padding:'10px 0'}} type="submit">
            Upload
          </button>
          </div>
      </Form>
  </Container>
  </>
 )
}

export default Upload
