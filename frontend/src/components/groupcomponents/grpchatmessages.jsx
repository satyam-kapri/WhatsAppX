import React from 'react'
import { v4 as uuidv4 } from "uuid";
import Avatar from '@mui/material/Avatar';
import { useRef,useEffect } from 'react';

export default function Grpchatmessages({messages,setmessages,currentgrpchat}) {
   const scrollref=useRef();
    useEffect(()=>{
      scrollref.current?.lastChild.scrollIntoView();
    },[messages])
  return (
    <div className="chat-messages" >
      
            {messages.map((message) => {
              return (
                
                <div ref={scrollref} key={uuidv4()}>
                    <div className={`${!message.fromSelf ?(!message.sender?"sysmessage":"grprecieved"):"grpsended"}`} style={{display:'flex',justifyContent:'space-between'}}>
                    <div >
                    {!message.fromSelf&&message.sender&&(message.senderprofilepic?<img src={message.senderprofilepic} style={{position:'relative',left:10,margin:'17px 10px',width:'2rem',height:'2rem',borderRadius:'50%'}}></img>:<Avatar sx={{position:'relative',left:10,margin:'17px 10px',width:'2rem',height:'2rem'}}>{message.sender[0].toUpperCase()}</Avatar>)}
                    </div>
                    <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    {!message.fromSelf && <span style={{color:'green',fontWeight:'bold',position:'relative',left:'-5px'}}>{message.sender}</span>}
                    <div className="content ">
                      <p>{message.message}</p>
                    </div>
                    <span className="timestamp">{String(new Date(message.timestamp).getHours()).padStart(2, '0') + ":" + String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}</span>
                  </div>
                  </div>
                </div>
              );
            })}
    </div>
  )
}

