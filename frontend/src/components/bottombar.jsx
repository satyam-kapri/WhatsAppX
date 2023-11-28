import React, { useEffect, useState } from 'react';
import bell from '../assets/bell-regular.svg';
import Notifications from './notifications';
import Settings from './settings';
import searchicon from '../assets/search-icon.svg';
import settingsicon from '../assets/settings-icon.svg';
import logouticon from "../assets/logout.svg";
import grpicon from "../assets/people.png";
import axios from 'axios';
import { getprofiledetails, logoutRoute } from '../utils/apiroutes';
import { useNavigate } from 'react-router-dom';

import Creategroupform from './groupcomponents/creategroupform';
import Searchusers from './Searchusers';
function Bottombar() {
    
    const navigate=useNavigate();
    
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
    <Settings open={settingsopen} setOpen={setsettingsopen}></Settings>
    <Searchusers open={searchopen} setopen={setsearchopen}></Searchusers>
    <div style={{
    width: '95%',
    background: '#2d2c2c',
    borderRadius: '40px',
    height: '62px',
    position: 'fixed',
    bottom: '25px',
    display:'flex',
    alignItems:'center',
    justifyContent:'space-around',
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
    }}> 
    <img src={bell} alt=''width={'18px'} style={{cursor:'pointer'}}onClick={notificationsopen}/>
       <img src={grpicon} alt="" width={'30px'} style={{cursor:'pointer'}}onClick={groupformopen}/>
       <img src={searchicon} alt="" width={'18px'} style={{cursor:'pointer'}}onClick={opensearch}/>
       <img src={settingsicon} alt="" width={'18px'} style={{cursor:'pointer'}}onClick={opensettings}/>
       <img src={logouticon}  width={'22px'} style={{cursor:'pointer'}} alt="" onClick={handleLogOut}/>
    </div>
    </>
  )
}

export default Bottombar;
