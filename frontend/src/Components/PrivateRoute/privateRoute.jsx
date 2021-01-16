import React from "react"
import { Redirect, Route } from "react-router-dom"
import parseCookie from "../../utils/parseCookie"
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !parseCookie(document.cookie) &&
        !parseCookie(document.cookie)["token"] ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  )
}
export default PrivateRoute
