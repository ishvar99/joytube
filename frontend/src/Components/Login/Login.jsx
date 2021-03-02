import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {Form,Button,Row,Col,Container} from 'react-bootstrap'
import { Link } from "react-router-dom"
import { LoginUser , GSignIn} from "../../redux/actions/authActions"
import { ClearError } from "../../redux/actions/authActions"
import GoogleSignIn from "../GoogleSignIn/GoogleSignIn"
import {GoogleLogin} from 'react-google-login'
const Login = (props) => {
  const auth = useSelector((state) => state.auth)
  const { error, isAuthenticated } = auth
  const dispatch = useDispatch()
  const [inputvalue, setinputvalue] = useState({
    email: "",
    password: "",
  })
  const [errorMsg, seterrorMsg] = useState({
    status: false,
    color: "",
    msg: "",
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setinputvalue({
      ...inputvalue,
      [name]: value,
    })
  }

  const googleSuccess=async (res)=>{
    console.log(res); 
    const result = res?.profileObj;
    const tokenId =res?.tokenId;
    dispatch(GSignIn({tokenId,result}))
  }
  const googleFailure=()=>{
    console.log('Google SignIn Failed!')
  }
  const formData = {
    email: inputvalue.email,
    password: inputvalue.password,
  }
  const checkErrors = () => {
    if (inputvalue.email && inputvalue.password) {
      return false
    }
    seterrorMsg({
      status: true,
      msg: "Please fill in all the details",
      color: "danger",
    })
    return true
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    if (!checkErrors()) {
      dispatch(ClearError())
      dispatch(LoginUser(formData))
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/")
    }
    if (error) {
      seterrorMsg({
        status: true,
        msg: error,
        color: "danger",
      })
    }
  }, [isAuthenticated, error, props.history])
  useEffect(() => {
    // Clear all the errors, when page is loaded
    seterrorMsg({
      status: false,
      color: "",
      msg: "",
    })
  }, [])
  return (
    <Container style={{marginTop:'20vh'}}>
    <Row className='justify-content-md-center w-100 m-0'>
      <Col xs={12} md={5}>
      <Form noValidate onSubmit={handleFormSubmit}>
      <h3 className='text-center'>Login</h3>
          {errorMsg.status ? (
            <div
              className={` w-75 mx-auto alert text-center alert-danger alert-dismissible fade show text-${errorMsg.color}`}
            >
              <h6>{errorMsg.msg}</h6>
              <button type="button"  onClick={() =>
                  seterrorMsg({ status: false, color: "", msg: "" })} class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
            </div>
          ) : null}

          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={inputvalue.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={inputvalue.password}
              onChange={handleChange}
            />
          </Form.Group>
          <div>
            <Link
              to="/password_reset" >
              <h6 className="forgot-password">Forgot password?</h6>
            </Link>
          </div>
          <div className="mx-auto text-center">
          <button className='btn w-25' style={{background:'#ff0038',color:'white',textAlign:'center'}} type="submit">
            Login
          </button>
          {/* <p style={{fontWeight:'500',marginBottom:'5px'}}>Or</p> */}
    
          </div>
          <Row className='py-3'>
        <Col className='text-center'> 
          I don't have an account?{" "}
          <Link style={{fontWeight:'500'}} to={'/register'}>
            Register
          </Link>
          <div style={{fontWeight:'500'}}>Or</div>
          <GoogleLogin 
    clientId="17398736997-lr6su6hfveu96ir3vgviuqanmb51a9t7.apps.googleusercontent.com"
    render={props=>(
      <GoogleSignIn clicked={props.onClick}/>
    )}
    onSuccess={googleSuccess}
    onFailure={googleFailure}
    cookiePolicy={'single_host_origin'}
  />,
          
        </Col>
      </Row>
      </Form>
      </Col>
      </Row>
    </Container>
  )
}

export default Login