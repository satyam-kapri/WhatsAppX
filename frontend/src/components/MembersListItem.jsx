import React, { useState } from 'react'
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import RequestButton from './RequestButton';
import ProfileViewer from './profileviewer';
import { Avatar, Chip } from '@mui/material';
import { green } from '@mui/material/colors';
import { useUserContext } from '../context/usercontext';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Checkbox from '@mui/material/Checkbox';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMediaQuery } from 'react-responsive';
function MembersListItem({item,admin,checked,handleToggle,showcheckbox}) {
    const [open,setopen]=useState(false);
    const {currUserDetails}=useUserContext();
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
    const imgstyle={
        width:'50px',height:'50px',borderRadius:'50%',cursor:'pointer'
    }
  return (
    
    <>
    <div>
     
          <ListItem key={item._id} sx={isMobile?{paddingLeft:'0',paddingRight:'0'}:{}}>
             {showcheckbox&&item._id!==admin&&
              <Checkbox
                      edge="end"
                      icon={<DeleteOutlineIcon></DeleteOutlineIcon>}
                      checkedIcon={<DeleteIcon sx={{color:'#d32f2f'}}></DeleteIcon>}
                      onChange={handleToggle(item)}
                      checked={checked.indexOf(item) !== -1}
                      
             />}
              <ListItemButton onClick={()=>setopen(true)}>
              <ListItemAvatar>
              {item.profileImage?<img src={item.profileImage} alt=''  style={imgstyle} ></img>:<Avatar sx={{width:'50px',height:'50px',bgcolor:green[500]}}></Avatar>}
             </ListItemAvatar>
              
               <ListItemText sx={{wordWrap:'break-word'}}>{item?.username}</ListItemText>
               </ListItemButton>
               <div style={isMobile?{display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '71px'}:{}}>
               {admin===item._id&&(<Chip label='admin' icon={<WorkspacePremiumIcon></WorkspacePremiumIcon>} ></Chip>)}
               {item._id!==currUserDetails._id &&<RequestButton id={item._id} btnstatus={item.status}></RequestButton>}
               </div>
              </ListItem>
              
      <Divider />
    </div>
    <ProfileViewer open={open} setOpen={setopen} id={item._id}></ProfileViewer>
    </>
 
   
  )
}

export default MembersListItem
