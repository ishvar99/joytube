import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import validator from "validator"
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
    <>
      <div className="Form">
        <form noValidate onSubmit={handleFormSubmit}>
          {Msg.status ? (
            <div
              className={`${
                Msg.color === "success" ? "success-div" : "error-div"
              } text-${Msg.color}`}
              style={{ textAlign: "center" }}
            >
              <h6>{Msg.msg}</h6>
              <span
                onClick={() => setMsg({ status: false, color: "", msg: "" })}
              >
                x
              </span>
            </div>
          ) : null}

          <h3>Forgot Password</h3>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={user ? user.email : inputvalue.email}
              onChange={handleChange}
            />
          </div>

          <button variant="primary" type="submit">
            Send password reset email
          </button>
        </form>
      </div>
    </>
  )
}

export default ForgotPassword
