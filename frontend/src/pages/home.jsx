import React, { useEffect, useState } from 'react'
import Chat from './chat';
import Leftsidebar from '../components/Leftsidebar';
import '../css/chat.css';
import { useNavigate } from "react-router-dom";
import { useUserContext } from '../context/usercontext';
import axios from 'axios';
import { getprofiledetails } from '../utils/apiroutes';
import { useMediaQuery } from 'react-responsive';
import Loading from './Loading';
export default function Home() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
  const {currUserDetails,setCurrUserDetails}=useUserContext();
  const [loading,setloading]=useState(false);
  useEffect(() => {
    async function fetch(){
      try{
      setloading(true);
      const res=await axios.get(getprofiledetails);
      setloading(false);
      setCurrUserDetails(res.data);
      }
      catch(err){
       navigate("/login");

      return;
    }
    
    }
    fetch();
  },[]);

    const homestyle={
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
    {loading&&<Loading></Loading>}
    <div style={homestyle}>
      
      {!isMobile&&<Leftsidebar></Leftsidebar>}
      <Chat></Chat>
      
    </div>
 
    </>
  )
}
