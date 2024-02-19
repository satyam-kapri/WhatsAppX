import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkloggedInorNot, loginRoute } from "../utils/apiroutes";
import "../css/login.css";
import Register from "./register";
import TextField from '@mui/material/TextField';
import loginlogo from '../assets/whatsapp logo.png';
import whatsapplogo from '../assets/Group 16.svg';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [registeropen,setregisteropen]=useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const toastOptions = {
    position: "top-left",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
 
  useEffect(() => {
    
    async function fetch(){
      try{
      const res=await axios.get(checkloggedInorNot);
      if(res.status===200)
      navigate('/');
    }
      catch(err){
        return;
      }
    }
    fetch();
   
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try{
        const { username, password } = values; 
        const{data} = await axios.post(loginRoute, {
        username,
        password,
      });
      
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          "chat-current-user",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }catch(e){console.log(e);toast.error("Server error please try again! ",toastOptions);}
  };
  }
   
  const gotoregister=()=>{
    setregisteropen(true);
  }
  return (
    <>
    <div className="fakebody">
      <div className="logo-heading">
        <img src={loginlogo} className="loginlogo" width={'160px'}></img>
        <img src={whatsapplogo} className="whatsapplogo" width={'200px'}></img>
      </div>
      { !registeropen?
      (
        <div className="form-outer">
      <div className="form-container">
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="form-heading">
            Login
          </div>
          <TextField id="outlined-basic" label="Username"  variant="outlined" name="username" onChange={(e) => handleChange(e)} style={{ width: '100%' }}/>
          {/* <TextField id="outlined-basic" label="Password"  variant="outlined" name="password" onChange={(e) => handleChange(e)}  style={{ width: '100%' }}/> */}
          <FormControl sx={{width:'100%'}}  variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            name="password"
            onChange={(e) => handleChange(e)} 
            />
            </FormControl>
          <button type="submit" className="loginsubmitbtn"><span>Submit</span></button>
          <span className="registerlink">
            Don't have an account?&nbsp;<Link onClick={gotoregister}>Create One.</Link>
          </span>
        </form>
      </div>
      </div>):(
      <Register setregisteropen={setregisteropen}></Register>
      )
       }
      </div>
       
      <ToastContainer />
    </>
  );
}

