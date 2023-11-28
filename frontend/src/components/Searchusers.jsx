import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import SearchIcon from '@mui/icons-material/Search';
import {  Divider, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import '../css/search.css';
import SearchListItem from './SearchListItem';
import axios from 'axios';
import List from '@mui/material/List';
import { searchFriends } from '../utils/apiroutes';
import CloseIcon from '@mui/icons-material/Close';
import searchimg from '../assets/image-removebg-preview (1).png';

function Searchusers({open,setopen}) {
    const [searchresults,setsearchresults]=React.useState(null);
    //-----------------------------------------------------------------------------------------------
    
     const handleClose = () => {
       setsearchresults(null);
       setopen(false);
     };
     //-----------------------------------------------------------------------------------------------
   let debounceTimeout;
    const handleinputchange=(e)=>{
     clearTimeout(debounceTimeout);
     if(e.target.value!=="" && e.target.value!==null &&e.target.value!==undefined){
     debounceTimeout=setTimeout(()=>{
      searchnow(e.target.value);
     },500);
   }
   else{setsearchresults(null);}
    }
    const searchnow=async(q)=>{
       const data=await axios.get(`${searchFriends}?q=${q}`);
      
       setsearchresults(data.data);
    }
  return (
    <div>
<React.Fragment >
<Drawer
  anchor={'top'}
  open={open}
  onClose={handleClose}
  
>
<div className='search-outer'>
<div className='search-inner'>
{/* <div style={{display:'flex',alignItems:'center'}}><img src={searchimg} style={{width:'50px',height:'50px'}}alt=""></img><span style={{fontSize:'17px',fontWeight:'400'}}>Add Contacts</span></div> */}
<div style={{height:'50px'}}>
<img src={searchimg} alt='' style={{
  width: '200px',
  zIndex: '0',
  height:'170px'
}}></img>

</div>
<Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%',
      borderRadius: '40px',
      background: '#313131',
      color: '#2c2929',
      height: '50px',zIndex:'1' }}
>
<InputBase
        sx={{ ml: 1, flex: 1 ,color:'white'}}
        placeholder="Search for username or email..."
        onChange={handleinputchange}
      />
<Divider sx={{ height: 28, m: 0.5,color:'white' }} orientation="vertical" />
<IconButton onClick={()=>{handleClose();}} color="primary" sx={{ p: '10px',background: '#fbfffa '}}>
       <CloseIcon />
 </IconButton>
</Paper>

{searchresults&&
            <List className='searchresultslist'sx={{width:'100%',overflow:'auto',marginTop:'10px',maxHeight:'500px',background:'white'}}>
            {searchresults.map((item)=>{
               
                return(
                <>
              <SearchListItem item={item}></SearchListItem>
              </>
                );
            })
            }
            </List>
            }
</div>
</div>
</Drawer>
</React.Fragment>
    </div>
  )
}

export default Searchusers



