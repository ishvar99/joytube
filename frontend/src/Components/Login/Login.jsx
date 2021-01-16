import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {Form,Button,Row,Col,Container} from 'react-bootstrap'
import { Link } from "react-router-dom"
import { LoginUser } from "../../redux/actions/authActions"
import { ClearError } from "../../redux/actions/authActions"
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
          </div>
          <Row className='py-3'>
        <Col className='text-center'> 
          I don't have an account?{" "}
          <Link style={{fontWeight:'500'}} to={'/register'}>
            Register
          </Link>
        </Col>
      </Row>
      </Form>
      </Col>
      </Row>
    </Container>
  )
}

export default Login