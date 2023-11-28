import React, { useState } from 'react'
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import RequestButton from './RequestButton';
import ProfileViewer from './profileviewer';
import { Avatar } from '@mui/material';
import { green } from '@mui/material/colors';

function SearchListItem({item}) {
    const [open,setopen]=useState(false);

    const imgstyle={
        width:'50px',height:'50px',borderRadius:'50%',cursor:'pointer'
    }
  return (
    <>
    <div>
     
              <ListItem key={item._id}>
              <ListItemButton onClick={()=>setopen(true)}>
              <ListItemAvatar>
              {item.profileImage?<img src={item.profileImage} alt=''  style={imgstyle} ></img>:<Avatar sx={{width:'50px',height:'50px',bgcolor:green[500]}}></Avatar>}
             </ListItemAvatar>
               <ListItemText>{item?.username}</ListItemText>
               </ListItemButton>
               <RequestButton id={item._id} btnstatus={item.status}></RequestButton>
              </ListItem>
              
      <Divider />
    </div>
    { open&&<ProfileViewer open={open} setOpen={setopen} id={item._id}></ProfileViewer>}
    </>
  )
}

export default SearchListItem
