import React, { useState } from 'react'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Button from '@mui/material/Button';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { useUserContext } from '../context/usercontext';
import { useWebSocket } from '../context/socketcontext';
import { Chip } from '@mui/material';
import { useMediaQuery } from 'react-responsive';
function RequestButton({id,btnstatus}) {
    const {currUserDetails}=useUserContext();
    const socket=useWebSocket();
    const [status,setstatus]=useState(btnstatus);
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
    const handlesendrequest=()=>{
        setstatus(2);
        socket.current.emit("send-friend-request",{
           from:currUserDetails._id,
           to:id,
           username:currUserDetails.username
        });
      
    }
  return (
    <div>
       {status===0&&
               <Button variant='outlined' sx={!isMobile?{width:'112px',marginLeft:'10px'}:{}}onClick={()=>{handlesendrequest();}}>{<PersonAddAlt1Icon/>}&nbsp;Request</Button>
       }
               {status===2&&
                <Button variant='outlined'sx={!isMobile?{width:'112px',marginLeft:'10px'}:{}} disabled><HourglassTopIcon></HourglassTopIcon>&nbsp;Pending</Button>
               }
               {
                status===1&&
                <Chip  sx={!isMobile?{marginLeft:'10px'}:{}}icon={<HowToRegIcon></HowToRegIcon>}label='friends'></Chip>
         }
    </div>
  )
}

export default RequestButton;
