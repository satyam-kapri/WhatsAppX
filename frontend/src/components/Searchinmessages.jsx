import React, { useState,useEffect } from 'react'
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import {  Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function Searchinmessages({messages,setshowmsgsearch}) {
    const [results,setresults]=useState(null);
    const [index,setindex]=useState(null);
    const handleinputchange=(e)=>{
        if(e.target.value)
        handlemessagesearch(e.target.value);
      
    }
    const handlemessagesearch=(query)=>{
        let data= messages.filter((m)=>{
            if(m.message?.toLowerCase().includes(query.toLowerCase())){
             return 1;
            }
            return 0;
        });
        setindex(data.length-1);
        setresults((pre)=>{
            pre?.forEach((m)=>{
                
                if(m.fromSelf)
                document.getElementById(`${m.messageid}`).style.background='#c3ffcb';
                else
                document.getElementById(`${m.messageid}`).style.background='white';
             })
             return data;
        });
    }
    useEffect(()=>{
       if(results?.length>=1){
     results.forEach((m)=>{
        document.getElementById(`${m.messageid}`).style.background='#9e90ff';
     })
     document.getElementById('message-scroller').scrollTo({left:0,top:document.getElementById(`${results[results.length-1].messageid}`).offsetTop-100,behavior:'smooth'});
    }
    },[results])
    const godownwards=()=>{
        
        if(index+1<results.length){
            document.getElementById('message-scroller').scrollTo({left:0,top:document.getElementById(`${results[index+1].messageid}`).offsetTop-100,behavior:'smooth'});
        setindex(pre=>pre+1);
        }
          
    }
    const goupwards=()=>{ 
      
        if(index>0){
           
            document.getElementById('message-scroller').scrollTo({left:0,top:document.getElementById(`${results[index-1].messageid}`).offsetTop-100,behavior:'smooth'});
           
            setindex(pre=>pre-1);
        }
    }
    const handleClose=()=>{
        setindex(0);
        setresults(null);
        setshowmsgsearch(false);
    }
  return (
    <div style={{position:'absolute',zIndex:'20'}}>
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
        placeholder="Search messages..."
        onChange={handleinputchange}
      />
<Divider sx={{ height: 28, m: 0.5,color:'white' }} orientation="vertical" />
<IconButton variant={'outlined'} onClick={goupwards} disabled={index<=0}><ArrowUpwardIcon sx={index===0?{color:'gray'}:{color:'white'}}></ArrowUpwardIcon></IconButton>
<Divider sx={{ height: 28, m: 0.5,color:'white' }} orientation="vertical" />
<IconButton onClick={godownwards} disabled={index>=results?.length-1}><ArrowDownwardIcon sx={index>=results?.length-1?{color:'gray'}:{color:'white'}}></ArrowDownwardIcon></IconButton>
<Divider sx={{ height: 28, m: 0.5,color:'white' }} orientation="vertical" />
<IconButton onClick={()=>{handleClose();}} color="primary" sx={{ p: '10px',background: '#fbfffa '}}>
       <CloseIcon />
 </IconButton>
</Paper>
    </div>
  )
}


export default Searchinmessages;
