import React,{useState} from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import {Form,Button,Row,Col,Container} from 'react-bootstrap'

const Upload = () => {
 axios.defaults.headers.post["Content-Type"] = "multipart/form-data"
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
const [title, setTitle] = useState("");
const [description,setDescription]=useState("");
const [privacy, setPrivacy] = useState(Privacy[0].label);
const [category, setCategory] = useState(Category[0].label);
const uploadFile=async (files)=>{
 console.log('upload triggered')
 let formData=new FormData();
 formData.append('file',files[0]);
 console.log(files[0])
 const response= await axios.post('/api/v1/videos/upload',formData)
 if(response.data.success){
  console.log(response.data);
 }
 else{
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
  <Dropzone accept="video/mp4" multiple={false} maxSize={800000000} onDrop={uploadFile}>
  {({getRootProps, getInputProps}) => (

    <div {...getRootProps()} style={{width:"50%",height:"250px",border:"1px solid lightgray", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <input  {...getInputProps()} />
  <i style={{fontSize:"32px",color:'#ff0038'}} class="fas fa-plus"></i>
  </div>
  )}
</Dropzone>
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
