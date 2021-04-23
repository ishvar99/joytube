import React, { useEffect, useState } from "react"
import validator from "validator"
import { useSelector, useDispatch } from "react-redux"
import { RegisterUser } from "../../redux/actions/authActions"
import {Form,Button,Row,Col,Container} from 'react-bootstrap'
import { Link } from "react-router-dom"
import { ClearError } from "../../redux/actions/authActions"
const Register = (props) => {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { error, isAuthenticated } = auth
  const [inputvalue, setinputvalue] = useState({
    uname: "",
    email: "",
    password: "",
    password2: "",
  })
  const [errorMsg, seterrorMsg] = useState({
    status: false,
    color: "",
    msg: "",
  })
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/")
    }
    if (error) {
      seterrorMsg({
        status: "true",
        msg: error === "Duplicate Key Error" ? "Email already exists" : error,
        color: "danger",
      })
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history])
  const handleChange = (event) => {
    const { name, value } = event.target

    setinputvalue({
      ...inputvalue,
      [name]: value,
    })
  }

  const formData = {
    name: inputvalue.uname,
    email: inputvalue.email,
    password: inputvalue.password,
    password2: inputvalue.password2,
  }
  const checkErrors = () => {
    if (
      inputvalue.uname &&
      inputvalue.password2 &&
      inputvalue.email &&
      inputvalue.password
    ) {
      if (validator.isEmail(inputvalue.email)) {
        if (inputvalue.password.length < 5) {
          seterrorMsg({
            status: true,
            msg: "Password should be atleast 6 characters",
            color: "danger",
          })
        } else if (inputvalue.password !== inputvalue.password2) {
          seterrorMsg({
            status: true,
            msg: "Passwords don't match!",
            color: "danger",
          })
        } else {
          return false
        }
      } else {
        seterrorMsg({
          status: true,
          msg: "Please provide a valid email",
          color: "danger",
        })
      }
    } else {
      seterrorMsg({
        status: true,
        msg: "Please fill in all the details",
        color: "danger",
      })
    }
    return true
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault()
    if (!checkErrors()) {
      dispatch(ClearError())
      dispatch(RegisterUser(formData))
    }
  }
  useEffect(() => {
    // Clear all the errors,when page is loaded
    seterrorMsg({
      status: false,
      color: "",
      msg: "",
    })
  }, [])
  return (

    <Container style={{marginTop:'15vh'}}>
    <Row className='justify-content-md-center w-100 m-0'>
      <Col xs={12} md={5}>
      <Form noValidate onSubmit={handleFormSubmit}>
      <h3 className='text-center'>Register</h3>
          {errorMsg.status ? (
            <div
              className={` w-75 mx-auto alert text-center alert-danger alert-dismissible fade show text-${errorMsg.color}`}
            >
              <h6>{errorMsg.msg}</h6>
              <button type="button"  onClick={() =>
                  seterrorMsg({ status: false, color: "", msg: "" })} className="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
            </div>
          ) : null}
         
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="uname"
              value={inputvalue.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
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
          <Form.Group>
            <label>Re-type Password</label>
            <Form.Control
              type="password"
              name="password2"
              value={inputvalue.password2}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="mx-auto text-center">
          <button className='btn w-25' style={{background:'#ff0038',color:'white',textAlign:'center'}} type="submit">
            Register
          </button>
          </div>
          <Row className='py-3'>
        <Col className='text-center'>
          Already have an account?{' '}
          <Link style={{fontWeight:'500'}} to={'/login'}>
            Login
          </Link>
        </Col>
      </Row>
        </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Register