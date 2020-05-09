import React,{useState} from 'react';
import {useHistory} from 'react-router-dom'
import 'materialize-css/dist/css/materialize.min.css';
import classNames from 'classnames';
import classes from './login.module.css'
import { useDispatch } from 'react-redux';
import loginUser from '../../actions/user_action';
const Login=(props)=>{
  const dispatch=useDispatch()
  const history=useHistory();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [errors,setErrors]=useState([])
  const validateForm=()=>{
    return email && password;  
  }
  const displayErrors=()=>{
    return errors.map((err,i)=><p key={i}>{err}</p>)
  }
  const submitForm=()=>{
    if(validateForm){
    dispatch(loginUser({email,password}))
    .then((res)=>{
      if(res.payload.loginStatus){
        history.push('/')
      }
      
    })
  }
  else{
    setErrors([...errors,"Empty fields!"])
  }
  }
    return (
      // card auth-card input-field
      <div className={classNames("card",classes.auth_card,"input-field")}>
      <h2>JoyTube</h2>
      <input type="email" className="validate" onChange={(event)=>setEmail(event.target.value)} placeholder="Email" />
      <input type="password" className="validate" onChange={(event)=>setPassword(event.target.value)} placeholder="Password"/>
      <span className="helper-text" data-error="wrong" data-success="right"></span>
      <button onClick={submitForm} className={classNames(classes.btn,"btn","waves-effect", "waves-light","#42a5f5 blue lighten-1")}>Login </button>
      <h6>Don't have an account?</h6>
  </div>
    );
}
export default Login;