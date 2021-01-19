import React, { Fragment, useEffect } from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { LogoutUser } from "../../redux/actions/authActions"
import { useSelector, useDispatch } from "react-redux"
import { LoadUser } from "../../redux/actions/authActions"
import BackDrop from "../../Components/Backdrop/Backdrop"
import parseCookie from "../../utils/parseCookie"
const Header = () => {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { loading, user, isAuthenticated } = auth
  console.log(user)
  useEffect(() => {
    async function fetchUser() {
      await dispatch(LoadUser())
    }
    let cookieObject = parseCookie(document.cookie)
    if (cookieObject && cookieObject["token"]) fetchUser()
  }, [])
  return (
    <>
      {loading ? <BackDrop/> : null}
      <div className="Header">
        <Navbar
          collapseOnSelect
          expand="lg"
          variant="dark"
          fixed="top"
          className="py-3 px-4 color-nav"
        >
          <Link to="/">
            <Navbar.Brand >
            <i style={{"fontSize":"22px"}} class="fab fa-youtube"></i><span style={{"fontSize":"20px","paddingLeft":"7px"}}>JoyTube</span>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
          {
            user?
            (
              <Fragment>
          <li className="nav-item ">
                <Link to="/" className="nav-link pl-5">
                  Videos
                </Link>
              </li>
              <li className="nav-item ">
                <Link to="/" className="nav-link">
                  Subscriptions
                </Link>
              </li>
              </Fragment>
            ):(null)
          }
          </Nav>
            <Nav className="ml-auto">
              {/* <li className="nav-item ">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li> */}
              {!user ? (
                <Fragment>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                </Fragment>
              ) : (
                <Fragment>
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Hello, {user.name.split(" ")[0]}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      onClick={() => dispatch(LogoutUser())}
                      style={{ cursor: "pointer" }}
                      className="nav-link"
                    >
                      Logout
                    </a>
                  </li>
                </Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  )
}

Header.propTypes = {}

export default Header
