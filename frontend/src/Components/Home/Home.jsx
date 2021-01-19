import React, { Fragment } from "react"
// import PropTypes from "prop-types"
import { useSelector } from "react-redux"
const Home = (props) => {
  const auth = useSelector((state) => state.auth)
  const { user } = auth
  console.log(user);
  return (
    <>
      
    </>
  )
}

// Home.propTypes = {}

export default Home
