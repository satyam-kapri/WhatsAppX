
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { getuserprofiledetails } from '../utils/apiroutes';
import { green } from '@mui/material/colors';
import { Avatar } from '@mui/material';
import { useMediaQuery } from 'react-responsive';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ProfileViewer({open,setOpen,id}) {
  const [user,setuser]=React.useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  const [loading,setloading]=React.useState(false);
  React.useEffect(()=>{

    async function fetch(){
      setloading(true);
      const data=await axios.get(`${getuserprofiledetails}/${id}`);
      setuser(data.data);
      setloading(false);
   
    }
    fetch();
  },[])
  const imgstyle1={
    width:'250px',height:'250px',borderRadius:'50%',bgcolor: green[500]
  }
  const imgstyle2={
    width:'400px',height:'400px',borderRadius:'50%',bgcolor: green[500]
  }
  const handleClose = () => {
    setOpen(false);
    
  };

  return (
    <React.Fragment>
      
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
      
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
         {user?.username}
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
        <DialogContent dividers>
{         loading?
        (
          <Stack spacing={1}>
          <Skeleton variant="circular" animation="wave"width={250} height={250} />
          <Skeleton variant="rounded" animation="wave" width={250} height={60} />
          </Stack>
        ):<>
          {user?.profileImage?<img style={isMobile?imgstyle1:imgstyle2} src={user?.profileImage}></img>:<Avatar sx={isMobile?imgstyle1:imgstyle2}></Avatar>}
          <Typography gutterBottom>
           Description:
          </Typography>
          </>
}
        </DialogContent>
        

      </BootstrapDialog>
    </React.Fragment>
  );
}

