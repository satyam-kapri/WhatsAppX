import React from 'react'
import { Avatar } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import People from '@mui/icons-material/People';
import { useMediaQuery } from 'react-responsive';
import { green } from '@mui/material/colors';
function Uploadprofilepic({handleFileChange,profilePic,group}) {
    const [isHovered, setIsHovered] = React.useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  return (
    <div>
       <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} >
        <label htmlFor="profilepicupload" >
         <div style={{border:'2px solid #bebdbe',width:`${isMobile?'250px':'300px'}`,height:`${isMobile?'250px':'300px'}`,borderRadius:'50%',position:'relative',cursor:'pointer'}}>
          {profilePic?<img src={profilePic} alt='profile' style={{filter:`${isHovered?'grayscale(2)':'none'}`,width:`${isMobile?'250px':'300px'}`,height:`${isMobile?'250px':'300px'}`,borderRadius:'50%'}} />:<Avatar sx={{width:`${isMobile?'250px':'300px'}`,height:`${isMobile?'250px':'300px'}`,borderRadius:'50%',background:green[500]}} variant="rounded">{group&&<People></People>}</Avatar>}
          {isHovered&&<AddAPhotoIcon sx={{position:'absolute',top:'37%',left:'37%',fontSize:'3rem',color:'white'}}></AddAPhotoIcon>}
         </div>
        </label>
        <input id="profilepicupload" type="file" style={{display:'none'}} onChange={handleFileChange}/>
        </div>
    </div>
  )
}

export default Uploadprofilepic
