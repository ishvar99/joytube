import React, { Fragment } from "react"
// import PropTypes from "prop-types"
import { useSelector } from "react-redux"
const Home = (props) => {
  const auth = useSelector((state) => state.auth)
  const { user } = auth
  console.log(user);
  return (
    <>
        {user && !user.confirmed ? (
        <div
          style={{ textAlign: "center",marginTop:"70px"}}
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          Confirmation mail send to{" "}
          <a href={"mailto:" + user.email}>{user.email}</a>. Please confirm your
          account to get started.
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      ) : null}
      <div className='video-grid'>
        <h3>Recommended</h3>
        <div className="row">
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 video-card">
        <img src="https://bit.ly/white-pigeon"/>
        <span>
          23:00
        </span>
        <div className='video-details'>
          <div className='channel-avatar'>
            <img src="https://bit.ly/black-pigeon"/>
          </div>
          <div style={{width:'100%'}} className='video-info'>
            <p style={{fontWeight:'500',width:"95%",marginBottom:'5px',color:'#030303'}}>Jee Main Exam Review | Student Reaction | 2021</p>
            <p style={{color:'#606060'}}>Channel Name</p> 
            <p style={{color:'#606060'}}>7.4M views . 3 years ago</p>
          </div>
        </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 video-card">
        <img src="https://bit.ly/white-pigeon"/>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 video-card">
        <img src="https://bit.ly/white-pigeon"/>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 video-card">
        <img src="https://bit.ly/white-pigeon"/>
        </div>
        
        </div>
      </div>
    </>
  )
}

// Home.propTypes = {}

export default Home
