import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

import { getprofiledetails, uploadprofilepic } from '../utils/apiroutes';
import axios from 'axios';
import {ToastContainer, toast,toastcontainer} from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import { useUserContext } from '../context/usercontext';
import Uploadprofilepic from './Uploadprofilepic';
import { CircularProgress } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Settings({open,setOpen,setcurrentprofilepic,currentprofilepic}) {
    const [username,setusername]=React.useState("A");
    const [profilePic,setprofilePic]=React.useState(null);
    const [file,setfile]=React.useState();
    const [disabled,setdisabled]=React.useState(true);
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
    const [loading,setloading]=React.useState(false);
   const {currUserDetails,setCurrUserDetails}=useUserContext();
    React.useEffect(()=>{
        // async function fetch(){
        //     setloading(true);
        //     const profiledata=await axios.get(getprofiledetails);
        //     setloading(false);
        //      setusername(profiledata.data.username);
        //      if(profiledata.data.profileImage)
        //      setprofilePic(profiledata.data.profileImage);
        // }
        // if(open===true)
        // fetch();
        if(currUserDetails){
        setusername(currUserDetails.username);
        if(currentprofilepic)
        setprofilePic(currentprofilepic);
        else
        setprofilePic(currUserDetails.profileImage);
        }
    },[open])

  const handleClose = () => {
    setdisabled(true);
    setfile(null);
    setOpen(false);
  };

  
    const handleFileChange = (e) => {
    const currfile = e.target.files[0];
    
    if (currfile) {
      const allowedImageTypes = ['image/jpeg', 'image/png','image/svg+xml']; 
      const allowedsize=1024*1024;
      if(!allowedImageTypes.includes(currfile.type)){
        toast.warning("Image type invalid! Only jpeg/png/svg allowed",{position:'top-center'});
        return;
     }
     
     if(allowedsize<currfile.size){
      toast.warning("Image size should be less than 1MB !",{position:'top-center'});
      return;
     }
      const imageUrl = URL.createObjectURL(currfile);
      setprofilePic(imageUrl);
      setfile(currfile);
    };
    setdisabled(false);
   }
    const uploadPicture =async () => {
      setdisabled(true);
      const allowedImageTypes = ['image/jpeg', 'image/png','image/svg+xml']; 
      const allowedsize=1024*1024;
    
     if(file){
        if(!allowedImageTypes.includes(file.type)){
           toast.warning("Image type invalid! Only jpeg/png/svg allowed",{position:'top-center'});
           return;
        }
        if(allowedsize<file.size){
          toast.warning("Image size should be less than 1MB !",{position:'top-center'});
          return;
         }
         console.log("yes");
     try{
      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('_id',currUserDetails._id );
      setloading(true);
      const res= await axios.post(uploadprofilepic,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
      if(res.status===200)toast.success("Saved Successfully!",{position:'bottom-left'});
      
      if(setcurrentprofilepic)
      {setcurrentprofilepic(res.data.pic);
        setCurrUserDetails()
      }
      setloading(false);
      }catch(err){
        if(err.response && err.response.status===500){
          toast.error("Something went wrong.Try again later!",{position:'bottom-left'});
        }
      }
    }
    }

  return (
    <>
    <ToastContainer theme='colored'></ToastContainer>
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
     
      >
        <DialogTitle sx={{ m: 0, p: 2 ,color:'black',display:'flex',alignItems:'center'}} id="customized-dialog-title">
           Profile
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
        <DialogContent sx={{minWidth:`${isMobile?250:500}px`,minHeight:`${isMobile?250:500}px`,display:'flex',flexDirection:'column',alignItems:'center'}}dividers>
         { loading&&<CircularProgress sx={{position:'absolute',zIndex:'20',top:'13rem'}}></CircularProgress>}
         <Uploadprofilepic handleFileChange={handleFileChange} profilePic={profilePic}></Uploadprofilepic>
        <Typography>
         Username: {username}
        </Typography>
        
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={uploadPicture} disabled={disabled}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
    </>
  );
}