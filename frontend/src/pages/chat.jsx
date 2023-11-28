import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/apiroutes";
import ChatContainer from "../components/chatContainer";
import Contacts from "../components/contacts";
import Welcome from "../components/welcome";
import '../css/chat.css';
import test from '../assets/Rectangle 1.svg';
import { useWebSocket } from "../context/socketcontext";
import { useContacts } from "../context/contactscontext";
import Groupchatcontainer from "../components/groupcomponents/groupchatcontainer";
import { useUserContext } from "../context/usercontext";
import { useMediaQuery } from 'react-responsive';
//-----------------------------------------------------------------------------------------------

export default function Chat() {

//----------------states-------------------------------------------------------------------------------
  
  const navigate = useNavigate();
  const socket=useWebSocket();
  const {contacts, updatecontacts} = useContacts();
  // const [contacts,updatecontacts]=useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [unseenmsglist,setunseenmsglist]=useState({});
  const [currentgrpchat,setCurrentgrpchat]=useState(null);
  const [forcererender,setforcererender]=useState(0);
  const {currUserDetails}=useUserContext();
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
//-----------------------------------------------------------------------------------------------
  
  useEffect(() => {
      if(currUserDetails)
      setCurrentUser(
        currUserDetails
      );
 
  }, [currUserDetails]);
//-----------------------------------------------------------------------------------------------
//----adding user to socket-------------------------------------------------------------------------------------------
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host); 
      socket.current.emit("add-user", currentUser._id);
      socket.current.on('force-rerender',()=>{
        
        setforcererender(forcererender=>forcererender+1);
        })
    }
  }, [currentUser]);
//-----------------------------------------------------------------------------------------------
//--------setting contacts---------------------------------------------------------------------------------------

  useEffect(() => {
    async function fetch(){
    if (currentUser) {
      try{
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`,{
          withCredentials: true,
        });
        if(data.status===401)navigate('/login');
        updatecontacts(data.data);
        let newlist={};
        data.data.forEach((e)=>{
          newlist[e._id]=e.unseencount?e.unseencount:0;
        })
        setunseenmsglist(newlist);
        
      } 
      catch(err){}
    }}
    fetch();
  }, [currentUser,forcererender]);

  
//-----------------------------------------------------------------------------------------------

//--------handle incoming messages for showing no. of unread messages---------------------------------------------------------------------------------------
  
  useEffect(()=>{
  
  if(socket.current && contacts){
  const socketref=socket.current;
    const handleMessage=(msg)=>{
    
      if( (currentChat===null||currentChat._id!==msg.from )&&(currentgrpchat===null||currentgrpchat._id!==msg.from)){
        if(unseenmsglist[msg.from])
        unseenmsglist[msg.from]+=1;
        else 
        unseenmsglist[msg.from]=1;
        setunseenmsglist({...unseenmsglist});
    
    const selcont=contacts.find((o)=>o._id===msg.from);
    
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
    selcont.recentMessage.text=msg.msg;
    selcont.recentMessage.createdAt=msg.time;
    
    updatecontacts(contacts);}
      }
    }
    
    socketref.on("msg-recieve",handleMessage);
    socketref.on("grp-msg-recieve",handleMessage);
    
    return () => {
      socketref.off("msg-recieve", handleMessage);
      socketref.off("grp-msg-recieve", handleMessage);
     
    };
  }
  },[currentChat,socket.current,currentgrpchat]);
 
//-----------------------------------------------------------------------------------------------

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  const changegroupchat=(chat)=>{
   setCurrentgrpchat(chat);
  }
//-----------------------------------------------------------------------------------------------
useEffect(()=>{
  if(isMobile &&(currentChat!==null || currentgrpchat!==null)){
     document.getElementById('contacts-container-mobile').style.display='none';
     document.getElementById('chatsformobile').style.display='block';
  }
},[currentChat,currentgrpchat])
useEffect(()=>{
  if(isMobile){
    document.getElementById('chatsformobile').style.display='none';
  }
},[isMobile]);
//-----------------------------------------------------------------------------------------------

  return (
    <>
        
        <div className="container">
         
          <Contacts  contacts={contacts} changeChat={handleChatChange} changegroupchat={changegroupchat} unseenmsglist={unseenmsglist}/>
          
          <div id='chatsformobile'>
          {
            currentUser!==undefined &&
          ( currentChat === null && currentgrpchat===null? (
            <Welcome />
          ) : (
            currentChat!==null?
            <ChatContainer currentChat={currentChat} setCurrentChat={setCurrentChat}socket={socket} contacts={contacts} updatecontacts={updatecontacts} setunseenmsglist={setunseenmsglist}/>
            :<Groupchatcontainer currentgrpchat={currentgrpchat} setCurrentgrpchat={setCurrentgrpchat}socket={socket} contacts={contacts} updatecontacts={updatecontacts}  setunseenmsglist={setunseenmsglist} ></Groupchatcontainer>
          ))}
          </div>
       
          
        </div>
   
    </>
  );
}
