import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import GrpInviteSelect from './grpinviteselect';
import { sendgrpinvite } from '../../utils/apiroutes';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import { useUserContext } from '../../context/usercontext';
export default function GrpInviteBox({open,setOpen,currentgrpchat}) {
  const [checked, setChecked] = React.useState([]);
  const {currUserDetails}=useUserContext();
  const handleClose = () => {
    setOpen(false);
  };
  const sendinvite=async()=>{
    handleClose();
    if(currUserDetails){
   const res=await axios.post(sendgrpinvite,{
    invitationarr:checked,
    fromuser:currUserDetails._id,
    grpid:currentgrpchat._id,

   });
   if(res.status===200)toast.success("Invitation successfully sent!",{position:"bottom-left" });
   else toast.error("Error sending invitation!",{position:"bottom-left" });
  }
  }
  return (
    <>
    <div>
     
      <Dialog
        fullWidth={'md'}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Select Contacts"}
        </DialogTitle>
        <DialogContent>
         <GrpInviteSelect checked={checked} setChecked={setChecked}></GrpInviteSelect> 
        </DialogContent>
        <DialogActions>
          <Button onClick={sendinvite}>Invite</Button>
        </DialogActions>
      </Dialog>
    </div>
    <ToastContainer  />
    </>

  );
}