import { LinearProgress } from '@mui/material'
import React from 'react'
import Box from '@mui/material/Box';
import whatsapplogo from '../assets/Group 16.svg';
import { useMediaQuery } from 'react-responsive';
function Loading() {
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
    const style={
        width:'100vw',
        height:'100vh',
        position:'fixed',
        background:'#141313',
        top:0,
        zIndex:2000,
        color:'white'
    }
    const style1={
        position:'absolute',
        top:'30vh',
        left:'25vw',
        width:'50vw',
        height:'20vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'flex-end',
        flexDirection:'column'
    }
    const style2={
        position:'fixed',
        bottom:'10vh',
        textAlign:'center'
    }
  return (
    <div style={style}>
    <div style={style1}>
    <img src={whatsapplogo} style={{width:'150px'}}></img>
      <Box sx={{ width: '80%' }}>
      <LinearProgress />
    </Box>
    <span style={isMobile?style2:{}}>The server may a take sometime to revoke. Please wait!</span>
    </div>
    </div>
  )
}

export default Loading
