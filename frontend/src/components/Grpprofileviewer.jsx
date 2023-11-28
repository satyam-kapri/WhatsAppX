
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { getgrpdetails, getuserprofiledetails, uploadgrpprofilepic } from '../utils/apiroutes';
import { green } from '@mui/material/colors';
import { Avatar, Button, List } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import GrpMembersViewer from './GrpMembersViewer';
import { useWebSocket } from '../context/socketcontext';
import { useUserContext } from '../context/usercontext';
import Uploadprofilepic from './Uploadprofilepic';
import {toast }from 'react-toastify';
import { useContacts } from '../context/contactscontext';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useMediaQuery } from 'react-responsive';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function GrpProfileViewer({open,setOpen,id}) {
  const [grp,setgrp]=React.useState(null);
  const socket=useWebSocket();
  const {currUserDetails}=useUserContext();
  const [memberlistforcererender,setmemberlistforcererender]=React.useState(false);
  const [profilePic,setprofilePic]=React.useState(null);
  const [file,setfile]=React.useState(null);
  const {contacts,updatecontacts}=useContacts();
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  React.useEffect(()=>{
   async function fetch(){
     const data=await axios.get(`${getgrpdetails}/${id}`);
     setgrp(data.data);
     if(data.data.profileImage)
     setprofilePic(data.data.profileImage);
   }
   fetch();
  },[memberlistforcererender]);
  
  const handleClose = () => {
    setOpen(false);
    
  };
  React.useEffect(()=>{
    if(socket)
    socket.current.on("memberlist-forcererender",()=>{
        setmemberlistforcererender(!memberlistforcererender);
      })
  },[socket])
  //-----------------------------------------------------------------------------------------------
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setprofilePic(imageUrl);
      setfile(file);
    };
   
   }
    const uploadPicture =async () => {
      if(file!==null){
     try{
      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('_id',grp._id );
      const res= await axios.post(uploadgrpprofilepic,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
     
      if(res.status===200){setfile(null);toast.success("Saved Successfully!",{position:'bottom-left'});}
       let temp=contacts.map((contact)=>{
        if(contact._id===grp._id){return {...contact,profileImage:res.data.pic}}
        return contact;
       })
       updatecontacts(temp);
      }catch(err){
        if(err.response && err.response.status===500){
          toast.error("Something went wrong.Try again later!",{position:'bottom-left'});
        }
      }
    }
    }
   const style1={width:'1200px',height:'600px',display:'flex',flexDirection:'row',justifyContent:'space-around'};
   const style2={width:'1200px',height:'600px',display:'flex',flexDirection:'column',justifyContent:'space-between',width:'90%'};
   
  return (
    <React.Fragment>
      
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={isMobile?{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
           width:'340px',
           margin:'0'
          },
        },
      }:{}}
      maxWidth={'xl'}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
         {grp?.grpname}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={isMobile?style2:style1}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',height:'300px'
      }}>
          {grp?.admin!==currUserDetails._id?
           (grp?.profileImage?<img src={grp.profileImage} alt='' style={!isMobile?{width:'300px',height:'300px',borderRadius:'50%'}:{width:'250px',height:'250px',borderRadius:'50%'}}></img>:<Avatar sx={!isMobile?{width:'300px',height:'300px',borderRadius:'50%',bgcolor:green[500]}:{width:'250px',height:'250px',borderRadius:'50%',bgcolor:green[500]}}><PeopleIcon/></Avatar>)
           :<Uploadprofilepic group={1}handleFileChange={handleFileChange} profilePic={profilePic}></Uploadprofilepic>
          }
          {file&&<Button variant='outlined'onClick={uploadPicture} style={{marginTop:'10px'}}><CloudUploadOutlinedIcon/>&nbsp;Upload</Button>}
        </div>
        <div style={{flexBasis:'50%'}}>
            <GrpMembersViewer members={grp?.members} admin={grp?.admin} grpid={grp?._id}></GrpMembersViewer>
        </div>

        </DialogContent>
        
      </BootstrapDialog>
    </React.Fragment>
  );
}

