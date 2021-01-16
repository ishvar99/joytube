import React from "react"
import "./Backdrop.scss"
const Backdrop = () => {
  return (
    <div className="loader-bg">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
export default Backdrop
