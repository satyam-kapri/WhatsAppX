import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Replymessage from './Replymessage';
export default function Messagedropdown({message,setreplyfor,setreply}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const s1={position:'absolute',right:'-50px',top:'10px',width:'0',height:'0',padding:'0'};
  const s2={position:'absolute',left:'-52px',top:'10px',width:'0',height:'0',padding:'0'};

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlereply=()=>{
    setreply (true);
    setreplyfor(message);
  }
  return (
    <>
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={message.fromSelf===true?s2:s1}
      >
       <div style={{borderRadius:'50%',background:'#a09e9e73',height:'23px'}}><ExpandMoreIcon sx={{color:'black'}}/></div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={()=>{handlereply();handleClose();}}>Reply</MenuItem>
        {/* <MenuItem onClick={handleClose}>Delete</MenuItem> */}
      </Menu>
    </div>
    
    </>
  );
}
