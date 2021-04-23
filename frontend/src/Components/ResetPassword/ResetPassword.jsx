import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ClearMessage } from "../../redux/actions/authActions"
import { ResetPasswordAction } from "../../redux/actions/authActions"
import {Form,Row,Col,Container} from 'react-bootstrap'
const ResetPassword = (props) => {
  const { match } = props
  const auth = useSelector((state) => state.auth)
  const { message, isAuthenticated } = auth
  const dispatch = useDispatch()
  const [inputvalue, setinputvalue] = useState({
    password: "",
    password2: "",
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
    password: inputvalue.password,
    password2: inputvalue.password2,
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    if (!inputvalue.password && !inputvalue.password2) {
      setMsg({
        status: true,
        msg: "Please fill in all the details",
        color: "danger",
      })
    } else if (inputvalue.password.length < 5) {
      setMsg({
        status: true,
        msg: "Password should be atleast 6 characters",
        color: "danger",
      })
    } else if (inputvalue.password !== inputvalue.password2) {
      setMsg({
        status: true,
        msg: "Passwords don't match!",
        color: "danger",
      })
    } else {
      dispatch(ClearMessage())
      dispatch(
        ResetPasswordAction(match.params.token, formData, isAuthenticated)
      )
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
        setTimeout(() => {
          props.history.push("/login")
        }, 4000)
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
      <h3 className='text-center'>Reset Password</h3>
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
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={inputvalue.password}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Retype new password</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              value={inputvalue.password2}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="mx-auto text-center">
          <button className='btn w-50' style={{background:'#ff0038',color:'white',textAlign:'center'}} type="submit">
          Reset Password
          </button>
          </div>
        </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default ResetPassword