import React, { useEffect, useState } from 'react';
import '../css/leftsidebar.css';
import chaticon from '../assets/chat-icon.svg';
import searchicon from '../assets/search-icon.svg';
import settingsicon from '../assets/settings-icon.svg';
import Creategroupform from './groupcomponents/creategroupform';
import logo2 from '../assets/logo2.svg';
import bell from '../assets/bell-regular.svg';
import Notifications from './notifications';
import Settings from './settings';
import axios from 'axios';
import { getprofiledetails, logoutRoute } from '../utils/apiroutes';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/usercontext';
import logouticon from "../assets/logout.svg";
import grpicon from "../assets/people.png";
import Searchusers from './Searchusers';
import Divider from '@mui/material/Divider';
export default function Leftsidebar() {
   
    const [currentusername,setcurrentusername]=useState('A');
    const [currentprofilepic,setcurrentprofilepic]=useState(null);
    const {currUserDetails}=useUserContext();
    const navigate=useNavigate();
    useEffect(()=>{
      
      if(currUserDetails){
        
        setcurrentusername(currUserDetails.username);
        setcurrentprofilepic(currUserDetails.profileImage);
      }
    },[currUserDetails])

    const [grpformopen, setgrpformopen] = React.useState(false);
    const [notsopen,setnotsopen]=React.useState(false);
    const [settingsopen,setsettingsopen]=React.useState(false);
    const [searchopen,setsearchopen]=React.useState(false);
    const groupformopen= () => {
      setgrpformopen(true);
    };
    const notificationsopen=()=>{
       setnotsopen(true);
    }
    const opensettings=()=>{
      setsettingsopen(true);
    }
    const opensearch=()=>{
      setsearchopen(true);
    }
    const handleLogOut=async()=>{
      await axios.get(logoutRoute);
      navigate('/login');
    }
  return (
    <>
    <Creategroupform  open={grpformopen} setopen={setgrpformopen}></Creategroupform>
    <Notifications open={notsopen} setopen={setnotsopen}></Notifications>
    <Settings open={settingsopen} setOpen={setsettingsopen} setcurrentprofilepic={setcurrentprofilepic} currentprofilepic={currentprofilepic}></Settings>
    <Searchusers open={searchopen} setopen={setsearchopen}></Searchusers>
    <div className='leftbar-container'>
      <div className='logo' onClick={opensettings}  style={{cursor:'pointer'}}><div className='myavatarcontainer'>{currentprofilepic?<img id="myavatar" src={currentprofilepic} alt="avatar" />:<Avatar>{currentusername[0].toUpperCase()}</Avatar>}</div></div>
      <div className='leftbar-bottom'>
        <img src={bell} alt=''width={'18px'} style={{cursor:'pointer'}}onClick={notificationsopen}/>
       <img src={grpicon} alt="" width={'30px'} style={{cursor:'pointer'}}onClick={groupformopen}/>
       <img src={searchicon} alt="" width={'18px'} style={{cursor:'pointer'}}onClick={opensearch}/>
       <img src={settingsicon} alt="" width={'18px'} style={{cursor:'pointer'}}onClick={opensettings}/>
       <Divider></Divider>
       <img src={logouticon}  width={'22px'} style={{cursor:'pointer',background: '#0cb000',padding: '9px',borderRadius: '10px'}}onClick={handleLogOut} alt="" />
      
      </div>
    </div>
    </>
  )
}
// `data:image/svg+xml;base64,${currentUserImage}`
