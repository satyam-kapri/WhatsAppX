import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { green } from '@mui/material/colors';
import GrpProfileViewer from './Grpprofileviewer';
import PeopleIcon from '@mui/icons-material/People';

function GrpsProfilePicture({item,style,showusername}) {
    const [open,setopen]=useState(false);
    
    const imgstyle2={
        width:'50px',height:'50px',borderRadius:'50%',cursor:'pointer',bgcolor:green[500]
    }
    const imgstyle1={
        width:'42px',height:'42px',borderRadius:'50%',cursor:'pointer',bgcolor:green[500],border:'2px solid white',boxSizing:'border-box'
    }
    
  return (
    <>
  
    <div style={{display:'flex',flexDirection:'horizontal',cursor:'pointer',alignItems:'center',width:'max-content'}} onClick={(e)=>{e.stopPropagation();setopen(true);}}>
     <div >{item.profileImage?<img src={item.profileImage} alt=''  style={style===1?imgstyle1:imgstyle2} onClick={()=>setopen(true)}></img>:<Avatar sx={style===1?imgstyle1:imgstyle2}><PeopleIcon/></Avatar>}</div>
     {showusername&&<div style={{margin:'0 0 5px 20px'}}>{item.name}</div>}
    </div>
      {open&&<GrpProfileViewer open={open}setOpen={setopen} id={item._id}></GrpProfileViewer>}
   
    </>
  )
}

export default GrpsProfilePicture
