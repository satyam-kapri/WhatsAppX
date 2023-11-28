import React, { useEffect } from 'react'
import Chat from './chat';
import Leftsidebar from '../components/Leftsidebar';
import '../css/chat.css';
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../context/usercontext';
import axios from 'axios';
import { getprofiledetails } from '../utils/apiroutes';
import { useMediaQuery } from 'react-responsive';
export default function Home() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
  const {currUserDetails,setCurrUserDetails}=useUserContext();
  useEffect(() => {
    async function fetch(){
      try{
      const res=await axios.get(getprofiledetails);
      setCurrUserDetails(res.data);
      }
      catch(err){
      if(err.response && err.response.status===401){
       navigate("/login");
       
      }
      return;
    }
    
    }
    fetch();},[]);

    const homestyle={
        // background:'#1F4EC7',
        // background: '#2f2e2e',
        // background:'linear-gradient(135deg,rgba(70, 43, 236, 1),rgba(202, 198, 255, 0.97))',
        // background:'linear-gradient(180deg,rgba(254, 42, 42, 1),rgba(215, 40, 114, 1))',
        background:'rgba(230, 230, 230, 0.98)',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        height:'100vh'
    }
    const imgstyle={
      position:'absolute',
      bottom:'0'
    }
    const imgstyle2={
      position: 'absolute',
    right: '133px',
    top: '0',
    opacity:'0.5'
    }
 
  return (
    <>
    <div style={homestyle}>
      
      {!isMobile&&<Leftsidebar></Leftsidebar>}
      <Chat></Chat>
      
    </div>
 
    </>
  )
}
