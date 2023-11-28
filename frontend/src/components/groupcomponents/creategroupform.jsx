import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useWebSocket } from './../../context/socketcontext';
import { useContacts } from './../../context/contactscontext';
import { useUserContext } from '../../context/usercontext';
export default function Creategroupform({open,setopen}) {
  const gradbackground='linear-gradient(45deg, rgb(26, 184, 22),  rgb(80 221 77)) ';
  //-----------------------------------------------------------------------------------------------
  const socket=useWebSocket();
  const {contacts,updatecontacts}=useContacts();
  const {currUserDetails}=useUserContext();
  const handleClose = () => {
    setopen(false);
  };
  //-----------------------------------------------------------------------------------------------
  const [grpname,setgrpname]=React.useState(null);

  const creategroup=async()=>{
  if(grpname!==null && grpname!=="" && currUserDetails){
   
  socket.current.emit('create-group',{
  groupName:grpname,
  userId:currUserDetails._id,
  username:currUserDetails.username
  })
  setgrpname(null);}
  else{

  }
  handleClose();
  }
  //-----------------------------------------------------------------------------------------------

  React.useEffect(()=>{
  if(socket.current){
   socket.current.on("group-created",({grpname,grpid,msg})=>{
    let grpdetails={username:grpname,_id:grpid,isgroup:true,recentMessage:{text:msg,createdAt:Date.now()}};
    console.log(contacts);
    updatecontacts([...contacts,grpdetails]);

    
  })}
  },[socket.current,contacts])

// -------------------------------------------------------------------------------------------------
  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth={true}>
        <DialogTitle >Create Group</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
          Give a name to your group
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Group Name"
            fullWidth
            variant="standard"
            onChange={(e)=>setgrpname(e.target.value)}
      
          />
        </DialogContent>
        <DialogActions>
          
          <Button onClick={creategroup} style={{background:gradbackground ,color:'white'}} variant='contained'>Create</Button>
          <Button onClick={handleClose}  variant='outlined'>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
