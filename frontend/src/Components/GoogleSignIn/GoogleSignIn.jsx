import React from 'react'
import './GoogleSignIn.scss'
const GoogleSignIn = (props) => {
 return (
  <>
    <div class="g_body">
    <button class="g-button" onClick={props.clicked}>
      <img class="g-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png" alt="Google Logo"/>
      <p class="g-text">Google Sign In</p>
    </button>
  </div>
</>
 )
}

export default GoogleSignIn
