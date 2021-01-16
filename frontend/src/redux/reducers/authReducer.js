import {
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  SET_LOADING,
  LOGIN_FAIL,
  REGISTER_FAIL,
  USER_LOADED,
  FORGOT_PASSWORD_ERROR,
  LOGOUT,
  AUTH_ERROR,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  RESET_PASSWORD_ERROR,
  CLEAR_ERROR,
  CLEAR_MESSAGE,
} from "../actions/types"
const initialState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  user: null,
}
export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        error: null,
      }
    }
    case SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
      }
    }
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR: {
      return {
        ...state,
        error: action.payload || "Server Error",
        loading: false,
        user: null,
      }
    }
    case USER_LOADED: {
      return {
        ...state,
        user: action.payload.data,
        loading: false,
        isAuthenticated: true,
        error: null,
      }
    }
    case LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      }
    }
    case FORGOT_PASSWORD:
    case RESET_PASSWORD: {
      console.log(action.payload)
      return {
        ...state,
        loading: false,
        message: action.payload,
      }
    }

    case FORGOT_PASSWORD_ERROR:
    case RESET_PASSWORD_ERROR: {
      return {
        ...state,
        loading: false,
        message: action.payload,
      }
    }
    case CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      }
    }
    case CLEAR_MESSAGE: {
      return {
        ...state,
        message: null,
      }
    }
    default:
      return state
  }
}
