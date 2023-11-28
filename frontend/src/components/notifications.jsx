import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import { getNotifications } from '../utils/apiroutes';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useWebSocket } from '../context/socketcontext';
import { useUserContext } from '../context/usercontext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import '../css/notifications.css';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import UsersProfilePicture from './UsersProfilePicture';
import GrpsProfilePicture from './GrpsProfilePicture';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Notifications({open,setopen}) {
 
 const gradbackground= `linear-gradient(45deg, rgba(26, 184, 22, 1), rgba(2, 94, 0, 1))`;
 const [notifications,setnotifications]=React.useState([]);
 const socket=useWebSocket();
 const {currUserDetails}=useUserContext();
 //-----------------------------------------------------------------------------------------------
 
  const handleClose = () => {
    setopen(false);
  };
  //-----------------------------------------------------------------------------------------------
  
 React.useEffect(()=>{
  async function fetch(){
   const data=await axios.get(`${getNotifications}/${currUserDetails._id}`);
   setnotifications(data.data);
  }
  if(open===true && currUserDetails)
  fetch();
 },[open])
 //-----------------------------------------------------------------------------------------------
 const grpinviteaccept=async(itemid,grpid)=>{
 
  if(socket.current && currUserDetails)
  socket.current.emit('accept-grp-invite',{
   itemid:itemid,
   grpid:grpid,
   userid:currUserDetails._id,
   username:currUserDetails.username
  });
  
 }
//-----------------------------------------------------------------------------------------------
const acceptfriendrequest=(itemid,senderid)=>{
  if(socket.current && currUserDetails)
  socket.current.emit('accept-friend-request',{
   itemid:itemid,
   userid:currUserDetails._id,
   senderid:senderid
  });
}
  return (
    <div>
      
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={'notifbar'}sx={{ position: 'relative',color:'white' }}>
          <Toolbar>
            <NotificationsIcon></NotificationsIcon>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Notifications
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          {notifications.map((item)=>{
                 return(
                 <>
                 {item.isgrpinvite &&
                 <ListItem key={item._id}>
                  <div style={{marginRight:'10px'}}><GrpsProfilePicture item={item.grpdetails} style={2}></GrpsProfilePicture></div>
                 <ListItemText primary="Group Invitation" secondary={`${item.senderdetails.username} invited you to join ${item.grpdetails.name}`}/>
                 <Button onClick={()=>{handleClose();grpinviteaccept(item._id,item.grpdetails._id);}}  variant='outlined'>Accept</Button>
                 &nbsp;
                 <Button onClick={handleClose} variant='outlined'>Reject</Button>
               </ListItem>}
               {
                item.isfriendrequest &&
                <ListItem>
                  <div style={{marginRight:'10px'}}><UsersProfilePicture item={item.senderdetails} style={2}></UsersProfilePicture></div> 
                  <ListItemText primary="Friend Request" secondary={`${item.senderdetails.username} wants you to be friends`}/>
                 <Button onClick={()=>{handleClose();acceptfriendrequest(item._id,item.sender);}}  variant='outlined'>Accept</Button>
                 &nbsp;
                 <Button onClick={handleClose} variant='outlined'>Reject</Button>

                </ListItem>
               }
               <Divider />
               </>
                 );
          })
          }
        </List>
      </Dialog>
    </div>
  );
}