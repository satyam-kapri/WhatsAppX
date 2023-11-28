import { useState, useEffect } from "react";
import phoneicon from "../../assets/Phone.svg";
import ChatInput from "../chatInput";

import axios from "axios";
import { sendGrpMessageRoute,recieveGrpMessageRoute } from "../../utils/apiroutes";
import GrpMenu from "./grpmenu";
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import { useUserContext } from "../../context/usercontext";
import GrpsProfilePicture from "../GrpsProfilePicture";
import { toast } from "react-toastify";
import { useMediaQuery } from 'react-responsive';
import Grpchatmessages from "./grpchatmessages";

export default function Groupchatcontainer({currentgrpchat,setCurrentgrpchat,socket,contacts,updatecontacts,setunseenmsglist}){
    
    const [messages,setmessages]=useState([]); 
    const {currUserDetails}=useUserContext();
    const isMobile = useMediaQuery({ query: '(max-width: 400px)' })
    //-----------------------------------------------------------------------------------------------
    async function fetchdata(){
     
      const response = await axios.post(recieveGrpMessageRoute, {
          from: currUserDetails._id,
          to: currentgrpchat._id,
         
        });
       
        setmessages(response.data.projectedMessages);
        socket.current.emit("seen-grp-message",{
          from: currUserDetails._id,
          to: currentgrpchat._id,
        })
        setunseenmsglist((pre)=>{
          pre[currentgrpchat._id]=0;
          return {...pre};
        })
      }
  
    useEffect(()=>{
        if(currentgrpchat!==null && currUserDetails)
       { fetchdata();}
    },[currentgrpchat]);
    
   
    //-----------------------------------------------------------------------------------------------
    
    const handleSendMsg = async (msg) => {
       if(currUserDetails){
        socket.current.emit("send-grp-msg", {
          to: currentgrpchat._id,
          from: currUserDetails.username,
          senderid:currUserDetails._id,
          msg,
          timestamp:Date.now(),
        });
        
        const res=await axios.post(sendGrpMessageRoute, {
            from: currUserDetails._id,
            to: currentgrpchat._id,
            message: msg,
            
          });
          console.log(res.data.status);
        if(res.data.status!==401){
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg,timestamp:Date.now()});
        setmessages(msgs);
        
        
        const selcont=contacts.find((o)=>o._id===currentgrpchat._id);
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
      }
      }};

    //-----------------------------------------------------------------------------------------------
    useEffect(() => {
      if (socket.current && currentgrpchat!==null) {
        const socketref=socket.current;
        const handleMessage= (msg) => {
        
          if(currentgrpchat._id===msg.from){
             
          setmessages((pre)=>
            [...pre,{ fromSelf: false, message: msg.msg,timestamp:msg.time,sender:msg.sender,senderprofilepic:msg.profilepic}]
          );
         
              
         const selcont=contacts.find((o)=>o._id===currentgrpchat._id);
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
         socket.current.emit("seen-grp-message",{
          from: currUserDetails._id,
          to: currentgrpchat._id,
        })   
         }
       }
        }
        socketref.on("grp-msg-recieve",handleMessage);
      
      
      return () => {
        socketref.off("grp-msg-recieve", handleMessage);
      };
    }
    }, [currentgrpchat,socket]);
    //-----------------------------------------------------------------------------------------------
    useEffect(()=>{
      const rerender= ({grpid,grpname})=>{
       
        if(currentgrpchat._id===grpid)
        setCurrentgrpchat(null);
       if(isMobile){
        document.getElementById('chatsformobile').style.display='none';
        document.getElementById('contacts-container-mobile').style.display='flex';
       }
       setTimeout(()=>{
        toast.error(`You have been kicked out of the ${grpname}`,{position:'top-center'});
       },500)
       
     }
      
      socket.current.on("currgrpchat-forcererender",rerender);
      return ()=>{socket.current.off("currgrpchat-forcererender",rerender);}
    },[]);
    
    //-----------------------------------------------------------------------------------------------
    const handlebackinmobile=()=>{
      document.getElementById('chatsformobile').style.display='none';
      document.getElementById('contacts-container-mobile').style.display='flex';
      setCurrentgrpchat(null);
     }
  
    //-----------------------------------------------------------------------------------------------
    
    return (
        <div className="chat-container">
          <div className="chat-header">
          {isMobile&&<ArrowLeftOutlinedIcon onClick={handlebackinmobile}/>}
            <div className="user-details">
              <div className="chatcontainer-avatar">
               
             <GrpsProfilePicture style={1} showusername={1} item={currentgrpchat}></GrpsProfilePicture>
              </div>
              
            </div>
            <div className="chat-header-icons">
             <div className="chat-header-icons-bg"><img src={phoneicon} alt="" width={'26px'}/></div> 
              {/* <img src={menuicon}alt="" width={'5px'} /> */}
             <div  className="chat-header-icons-bg"><GrpMenu currentgrpchat={currentgrpchat} setcurrentgrpchat={setCurrentgrpchat}></GrpMenu></div> 
            </div>
          </div>
          <div className="chat-message-input-wrapper">
           <Grpchatmessages messages={messages} setmessages={setmessages} currentgrpchat={currentgrpchat}></Grpchatmessages>
          
          <ChatInput handleSendMsg={handleSendMsg} />
          </div>
        </div>
      );
    }
