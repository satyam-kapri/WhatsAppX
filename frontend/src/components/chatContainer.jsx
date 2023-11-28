import React, { useState, useEffect, useRef } from "react";
import phoneicon from "../assets/Phone.svg";
import menuicon from "../assets/menu-icon.svg";
import ChatInput from "./chatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/apiroutes";
import '../css/chatcontainer.css';
import { useUserContext } from "../context/usercontext";
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import UsersProfilePicture from "./UsersProfilePicture";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Messagedropdown from "./Messagedropdown";
import Replymessage from "./Replymessage";
import {  LinearProgress } from "@mui/material";
import { useMediaQuery } from 'react-responsive';
import Searchinmessages from "./Searchinmessages";
import searchblackicon from '../assets/searchblackicon.svg';
//-----------------------------------------------------------------------------------------------

export default function ChatContainer({ currentChat,setCurrentChat,socket,contacts,updatecontacts,setunseenmsglist}) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const {contacts,updatecontacts}=useContacts();
  const {currUserDetails}=useUserContext();
  const [reply,setreply]=useState(false);
  const [replyfor,setreplyfor]=useState(null);
  const [loading,setloading]=useState(true);
  //-----------------------------------------------------------------------------------------------
  const [progress, setProgress] = React.useState(0);
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  const [showmsgsearch,setshowmsgsearch]=useState(false);
  //-----------------------------------------------------------------------------------------------
  
  useEffect( () => {
    setMessages([]);
    setshowmsgsearch(false);
    async function fetch(){
    setloading(true);
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 80) {
          return 80;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 80);
      });
    }, 200);
    const response = await axios.post(recieveMessageRoute, {
      from: currUserDetails._id,
      to: currentChat._id,
    });
    
      clearInterval(timer);
   
      setProgress(100);
      setloading(false);
  
      setMessages(response.data);
      
    
    

    if(response.data.length>=1&& !response.data[response.data.length-1].fromSelf)
    {socket.current.emit("seen-message",{
      to: currUserDetails._id,
      from: currentChat._id,
    })
  }
    setunseenmsglist((pre)=>{
      pre[currentChat._id]=0;
      return {...pre};
    })
   
  }
    if(currUserDetails)
    fetch();
  }, [currentChat,currUserDetails]);
//-----------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------

  const handleSendMsg = async (msg) => {
   if(currUserDetails){
    const res=await axios.post(sendMessageRoute, {
      from: currUserDetails._id,
      to: currentChat._id,
      message: msg,
      replyfor:replyfor?.messageid
    });
   
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currUserDetails._id,
      msg,
      messageid:res.data.messageid,
      sender:currUserDetails.username,
      senderid:currUserDetails._id,
      timestamp:Date.now(),
      replyfor:replyfor
    });
    
    
    const msgs = [...messages];
  
    msgs.push({messageid:res.data.messageid, fromSelf: true, message: msg,timestamp:Date.now(),seen:false,replyfor:replyfor});
    setMessages(msgs);
    
    setreply(false);
    setreplyfor(null);
    const selcont=contacts.find((o)=>o._id===currentChat._id);
    if (selcont) {
      if (!selcont.recentMessage) {
        selcont.recentMessage = {};
      }
      if (!selcont.recentMessage.message) {
        selcont.recentMessage.message = {};
      }
      if(!selcont.recentMessage.createdAt){
        selcont.recentMessage.createdAt={};
      }
    selcont.recentMessage.message.text=msg;
    selcont.recentMessage.createdAt=Date.now();
   
    updatecontacts(contacts);
    }
  }};
  
//-----------------------------------------------------------------------------------------------

  useEffect(() => {
    if (socket.current) {
      const socketref=socket.current;
      const handleMessage= (msg) => {
      
        if(currentChat._id===msg.from){
          
        setArrivalMessage({ messageid:msg.messageid,fromSelf: false, message: msg.msg,timestamp:msg.time,sender:msg.sender,senderid:msg.senderid,replyfor:msg.replyto});
            
       const selcont=contacts.find((o)=>o._id===currentChat._id);
       if (selcont) {
         if (!selcont.recentMessage) {
           selcont.recentMessage = {};
         }
         if (!selcont.recentMessage.message) {
           selcont.recentMessage.message = {};
         }
         if(!selcont.recentMessage.createdAt){
           selcont.recentMessage.createdAt={};
         }
       selcont.recentMessage.message.text=msg.msg;
       selcont.recentMessage.createdAt=msg.time;
      
       updatecontacts(contacts);
       setTimeout(()=>{
        socket.current.emit("seen-message",{
          to: currUserDetails._id,
          from: currentChat._id,
        })  
       },500);
      
       }
     }
      }
      socketref.on("msg-recieve",handleMessage);
    
    
    return () => {
      socketref.off("msg-recieve", handleMessage);
    };
  }
  }, [currentChat]);

//-----------------------------------------------------------------------------------------------

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.lastChild.scrollIntoView();
  }, [messages]);
//-----------------------------------------------------------------------------------------------
   useEffect(()=>{
      const handle=()=>{
        
        let messages2=[...messages];
       
        for(let i=messages2.length-1;i>0;i--){
          if(messages2[i].seen)break;
          messages2[i].seen=true;
        }
     
        setMessages(messages2);
      }
    
      socket.current.on("message-read",handle);
     
      
      return ()=>{socket.current.off("message-read",handle)}
   },[messages])
   //-----------------------------------------------------------------------------------------------
   const movetomessage=(msgid,yes)=>{
    document.getElementById(`${msgid}`).scrollIntoView({behavior:"smooth" ,block: 'center' });
    
    document.getElementById(`${msgid}`).style.background='rgb(188 255 252)';
    setTimeout(()=>{
      if(yes)
      document.getElementById(`${msgid}`).style.background='#c3ffcb';
      else
      document.getElementById(`${msgid}`).style.background='white';
    },1000)
   
   }
   //-----------------------------------------------------------------------------------------------
   const handlebackinmobile=()=>{
    document.getElementById('chatsformobile').style.display='none';
    document.getElementById('contacts-container-mobile').style.display='flex';
    setCurrentChat(null);
   }
   //-----------------------------------------------------------------------------------------------
  
      
   
  return (
    <div className="chat-container">
      <div className="chat-header">
      {isMobile&&<ArrowLeftOutlinedIcon onClick={handlebackinmobile}/>}
        <div className="user-details">
         
          <div className="chatcontainer-avatar">
            <UsersProfilePicture item={currentChat} style={1} showusername={1}></UsersProfilePicture>
          </div>
          
        </div>
        <div className="chat-header-icons">
          <div className="chat-header-icons-bg" onClick={()=>{setshowmsgsearch(true);}} style={{cursor:'pointer'}}><img src={searchblackicon} alt="" width={'20px'}/></div>
          <div className="chat-header-icons-bg" style={{cursor:'pointer'}}><img src={menuicon}alt="" width={'5px'} /></div>
        </div>
      </div>
      <div className="chat-message-input-wrapper">
      {loading&&<LinearProgress variant="determinate" value={progress} sx={{width:'100%'}}/>}
      {showmsgsearch&&<Searchinmessages messages={messages} setshowmsgsearch={setshowmsgsearch}></Searchinmessages>}
      <div className="chat-messages" id="message-scroller">
      
        {messages.map((message) => {
          return (
            
            <div ref={scrollRef}  key={uuidv4()}>
               <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`} 
                id={message.messageid}
              >
                 {message.replyfor&&
                  <div className='replymsg-inner' onClick={()=>{movetomessage(message.replyfor.messageid,message.replyfor.senderid===currUserDetails._id)}} style={{cursor:'pointer'}}>
                  <span className='replymsg-sender' style={{color:'green',fontWeight:'600'}}>{message.replyfor.senderid===currUserDetails._id?"You":message.replyfor.sender}</span>
                  <span className='replymsg-text'>{message.replyfor.message}</span>
                  </div>
                  }
                <div className="content ">
                  <Messagedropdown message={message} setreplyfor={setreplyfor} setreply={setreply}></Messagedropdown>
                 
                  <p>{message.message}</p>
                 {message.fromSelf&&<span style={{position:'absolute',right:'4px',bottom:'-4px'}}><DoneAllIcon sx={message.seen===true?{color:'blue',width:'16px'}:{color:'gray',width:'16px'}}/></span>}
                </div>
                <span className="timestamp">{String(new Date(message.timestamp).getHours()).padStart(2, '0') + ":" + String(new Date(message.timestamp).getMinutes()).padStart(2, '0')}</span>
               </div>
            </div>
            
          );
        })}
      </div>
      {reply&&<Replymessage replyfor={replyfor} setreply={setreply} setreplyfor={setreplyfor}></Replymessage>}
      <ChatInput handleSendMsg={handleSendMsg}  />
      </div>
    </div>
  );
}

