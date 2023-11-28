import React, { useState, useEffect } from "react";
import styled from "styled-components";
import illustration from "../assets/young man smiling and holding smartphone.png";
import msgboxsvg from "../assets/Rectangle 25.svg";
import { useUserContext } from "../context/usercontext";
import chatbg from '../assets/image 1.png';
import '../css/welcome.css';
export default function Welcome() {
  const [userName, setUserName] = useState("");
  const {currUserDetails}=useUserContext();
  useEffect( () => {
    async function fetch(){
      if(currUserDetails)
    setUserName(
     
      currUserDetails.username
    );}
    fetch();
  }, [currUserDetails]);
  return (
    <Container>
      <div className='welcomewrapper'>
       <div className="welcomemsg">
       {/* <img src={msgboxsvg}></img> */}
        {/* <div className="welcomemsgtxt"><span>Hey! <span className="specialname">{userName}</span></span><br></br><span> Tap on a contact to get started</span></div> */}
       
       </div>
       {/* <img className="boyimg" src={illustration} alt="" /> */}
       </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  color: white;
  flex-basis: 96%;
  height: -webkit-fill-available;
  flex-direction: column;
  border-radius:20px;
  .boyimg {
    height: 23rem;transform:translate(133px,10px);
  }
  .welcomemsg{
    position:relative;
    width: 73%;
    height: 50%;
    transform: translate(35%, 56%);
  }
  .welcomemsg img{
    position:absolute;
  }
  .welcomemsgtxt{
    position: absolute;
    width: 20rem;
    top: 23%;
    left: 20%;
    font-size: 1.5rem;
    color: black;
    word-wrap: break-word;
    z-index:2;
  }
  .welcomemsgtxt .specialname{
   color:red;
  }
`;