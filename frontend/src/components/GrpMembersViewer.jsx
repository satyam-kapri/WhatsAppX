import React from 'react'
import { Button, Divider, List, ToggleButton } from '@mui/material';
import MembersListItem from './MembersListItem';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWebSocket } from '../context/socketcontext';
import { useUserContext } from '../context/usercontext';

function GrpMembersViewer({members,admin,grpid}) {
    const [checked, setChecked] = React.useState([]);
    const [showcheckbox,setshowcheckbox]=React.useState(false);
    const [allmembers,setallmembers]=React.useState(members);
    const socket=useWebSocket();
    const {currUserDetails}=useUserContext();
    React.useEffect(() => {
        setallmembers(members);
      }, [members]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const handlekickout=()=>{
  
    let checkedids=checked.map((e)=>e._id);
  
    setChecked([]);
    if(socket)
    socket.current.emit('kickout-fromgrp',{
      userids:checkedids,
      grpid:grpid,
      adminid:currUserDetails._id
    });
    
    
  }
  return (
    <> 
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
      <span style={{fontWeight:'400',fontSize:'17px'}}>Members</span>
      {currUserDetails._id===admin&&<Button variant={'outlined'}size="small" sx={{borderRadius:'20px',textTransform:'none',fontSize:'15px'}} color="primary"   onClick={() => {setshowcheckbox(!showcheckbox);}}>&nbsp;Edit Members</Button>}
      </div>
       <Divider></Divider>
            <List sx={{}}>
                {allmembers?.map((m,idx)=>{
                    return(
                    <MembersListItem key={idx} item={m} admin={admin} handleToggle={handleToggle} checked={checked} showcheckbox={showcheckbox}></MembersListItem>
                    );
                })}
            </List>
        {currUserDetails._id===admin&&showcheckbox&&<Button color='error' startIcon={<DeleteIcon /> } variant='contained' disabled={checked.length<1} onClick={handlekickout}>KickOut Selected</Button>}
    </>
  )
}

export default GrpMembersViewer
