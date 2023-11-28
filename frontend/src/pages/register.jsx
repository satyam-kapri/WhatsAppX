import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/apiroutes";
import TextField from '@mui/material/TextField';
export default function Register({setregisteropen}) {
  const navigate = useNavigate();
  const toastOptions = {
    position: "top-left",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
 
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        navigate('/');
        
      }
    }
  };

  return (
    <>
      
      <div className="form-container" style={{height:'89vh'}}>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="form-heading">
            Register
          </div>
          <TextField id="outlined-basic" label="Username"  variant="outlined" name="username" onChange={(e) => handleChange(e)} style={{ width: '100%' }}/>
          <TextField id="outlined-basic" label="Email"  variant="outlined" name="email" onChange={(e) => handleChange(e)}  style={{ width: '100%' }}/>
          <TextField id="outlined-basic" label="Password"  variant="outlined" name="password" type={'password'} onChange={(e) => handleChange(e)}  style={{ width: '100%' }}/>
          <TextField id="outlined-basic" label="Confirm Password"  variant="outlined" name="confirmPassword" type={'password'} onChange={(e) => handleChange(e)}  style={{ width: '100%' }}/>
          
          <button type="submit" className="loginsubmitbtn"><span>Create User</span></button>
          <span className="loginlink">
            Already have an account ? <Link onClick={()=>{setregisteropen(false)}}>Login.</Link>
          </span>
        </form>
        </div>
    
      <ToastContainer />
    </>
  );
}

