import React from 'react'
import '../css/replymessage.css';
import CloseIcon from '@mui/icons-material/Close';
import { useUserContext } from '../context/usercontext';
function Replymessage({replyfor,setreply,setreplyfor}) {
    
  return (
    <>
     
      <div className='replymsg-outer'>
        <div className='replymsg-inner'>
            <span className='replymsg-sender' style={{color:'green',fontWeight:'600'}}>{replyfor.fromSelf?"You":replyfor.sender}</span>
            <span className='replymsg-text'>{replyfor.message}</span>
        </div>
        <CloseIcon onClick={()=>{setreplyfor(null);setreply(false);}} sx={{cursor:'pointer',marginLeft:'5px'}}></CloseIcon>
      </div>
    </>
  )
}

export default Replymessage
