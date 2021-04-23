import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import validator from "validator"
import {Form,Button,Row,Col,Container} from 'react-bootstrap'
import { ClearMessage } from "../../redux/actions/authActions"
import { ForgotPasswordAction } from "../../redux/actions/authActions"
const ForgotPassword = (props) => {
  const auth = useSelector((state) => state.auth)
  const { message, user } = auth
  const dispatch = useDispatch()
  const [inputvalue, setinputvalue] = useState({
    email: "",
  })
  const [Msg, setMsg] = useState({
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
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    if (!user && !inputvalue.email) {
      setMsg({
        status: true,
        msg: "Please fill in all the details",
        color: "danger",
      })
    } else if (!user && !validator.isEmail(inputvalue.email)) {
      setMsg({
        status: true,
        msg: "Please provide a valid email",
        color: "danger",
      })
    } else {
      dispatch(ClearMessage())
      user
        ? dispatch(ForgotPasswordAction({ email: user.email }))
        : dispatch(ForgotPasswordAction(formData))
    }
  }
  useEffect(() => {
    if (message) {
      console.log(message)
      if (message.data) {
        setMsg({
          status: true,
          msg: message.data,
          color: "success",
        })
      } else if (message.error) {
        setMsg({
          status: true,
          msg: message.error,
          color: "danger",
        })
      }
    }
  }, [message, props.history])
  useEffect(() => {
    // Clear all the errors, when page is loaded
    setMsg({
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
        <h3 className='text-center'>Forgot Password</h3>
          {Msg.status ? (
            <div
              className={` w-75 mx-auto alert text-center ${Msg.color==='success'?"alert-success":"alert-danger"} alert-dismissible fade show text-${Msg.color}`}
            >
              <h6>{Msg.msg}</h6>
              <button type="button"  onClick={() =>
                  setMsg({ status: false, color: "", msg: "" })} className="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
            </div>
            
          ) : null}
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={user ? user.email : inputvalue.email}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="mx-auto text-center">
          <button className='btn w-75' style={{background:'#ff0038',color:'white',textAlign:'center'}} type="submit">
          Send password reset email
          </button>
          </div>
        </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ForgotPassword