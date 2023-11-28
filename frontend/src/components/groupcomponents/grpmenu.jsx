import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import menuiconsvg from '../../assets/menu-icon.svg';
import GrpInviteBox from './grpinvitebox';
import { useWebSocket } from '../../context/socketcontext';
import { useUserContext } from '../../context/usercontext'
import {toast} from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
export default function AccountMenu({currentgrpchat,setcurrentgrpchat}) {
  const socket=useWebSocket();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [opengrpinvite, setopengrpinvite] = React.useState(false);
  const {currUserDetails}=useUserContext();
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlegrpinviteOpen=()=>{
   setopengrpinvite(true);
  }
  const handleLeaveGroup=()=>{
    socket.current.emit("leave-group",{
    grpid:currentgrpchat._id,
    userid:currUserDetails._id,
    username:currUserDetails.username
    });
    handleClose();
    if(isMobile){
    document.getElementById("chatsformobile").style.display='none';
    document.getElementById('contacts-container-mobile').style.display='block';}
    setcurrentgrpchat(null);
    toast.success("Group Leaved Successfully!",{position:"bottom-left"});
  }


  return (
    <>
    <React.Fragment>
   
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
             <img src={menuiconsvg} alt='' width={'5px'}/>
          </IconButton>
      
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        
        
        <MenuItem onClick={handlegrpinviteOpen}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Invite Members
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLeaveGroup}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Leave Group
        </MenuItem>
      </Menu>
    </React.Fragment>


    <GrpInviteBox  open={opengrpinvite} setOpen={setopengrpinvite} currentgrpchat={currentgrpchat} ></GrpInviteBox>
    
    </>
  );
}