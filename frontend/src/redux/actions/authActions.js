import {
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  SET_LOADING,
  LOGIN_FAIL,
  REGISTER_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_ERROR,
  FORGOT_PASSWORD,
  CLEAR_ERROR,
  CLEAR_MESSAGE,
} from "./types"
import axios from "axios"
axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.headers.put["Content-Type"] = "application/json"
const REGISTER_URL = "/api/v1/auth/register"
const LOGIN_URL = "/api/v1/auth/login"
const GET_CURRENT_USER = "/api/v1/auth/me"
const FORGOT_PASSWORD_URL = "/api/v1/auth/forgotpassword"
export const LoadUser = () => {
  return async (dispatch) => {
    try {
      dispatch(SetLoading())
      const response = await axios.get(GET_CURRENT_USER)

      dispatch({ type: USER_LOADED, payload: response.data })
    } catch (error) {
      dispatch({ type: AUTH_ERROR, payload: error.response.data.err })
    }
  }
}
export const LoginUser = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(SetLoading())
      const response = await axios.post(LOGIN_URL, JSON.stringify(formData))
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      })
      dispatch(LoadUser())
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.error,
      })
    }
  }
}
export const RegisterUser = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(SetLoading())
      const response = await axios.post(REGISTER_URL, JSON.stringify(formData))
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response.data,
      })
      dispatch(LoadUser())
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.error,
      })
    }
  }
}
export const LogoutUser = () => {
  return async (dispatch) => {
    try {
      dispatch(SetLoading())
      await axios.get("/api/v1/auth/logout")
      dispatch({ type: LOGOUT })
    } catch (error) {
      console.log(error)
    }
  }
}
export const ForgotPasswordAction = (formData) => {
  return async (dispatch) => {
    try {
      dispatch(SetLoading())
      const response = await axios.post(
        FORGOT_PASSWORD_URL,
        JSON.stringify(formData)
      )
      dispatch({
        type: FORGOT_PASSWORD,
        payload: response.data,
      })
    } catch (error) {
      dispatch({
        type: FORGOT_PASSWORD_ERROR,
        payload: error.response.data,
      })
    }
  }
}
export const ResetPasswordAction = (token, formData, isAuthenticated) => {
  return async (dispatch) => {
    try {
      dispatch(SetLoading())
      const response = await axios.put(
        `/api/v1/auth/resetpassword/${token}`,
        JSON.stringify(formData)
      )
      dispatch({
        type: RESET_PASSWORD,
        payload: response.data,
      })
      if (isAuthenticated) dispatch(LogoutUser())
    } catch (error) {
      dispatch({
        type: RESET_PASSWORD_ERROR,
        payload: error.response.data,
      })
    }
  }
}
export const SetLoading = () => {
  return async (dispatch) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    })
  }
}

export const ClearError = () => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_ERROR })
  }
}
export const ClearMessage = () => {
  return async (dispatch) => {
    dispatch({ type: CLEAR_MESSAGE })
  }
}
