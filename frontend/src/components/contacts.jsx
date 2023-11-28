import React, { useState, useEffect } from "react";
import searchblackicon from '../assets/searchblackicon.svg';
import '../css/contactscontainer.css';
import { useContacts } from "../context/contactscontext";
import { useUserContext } from "../context/usercontext";
import nocontacts from '../assets/4780235.webp';
import UsersProfilePicture from "./UsersProfilePicture";
import GrpsProfilePicture from "./GrpsProfilePicture";
import Bottombar from "./bottombar";
import { useMediaQuery } from "react-responsive";
import Contactsfilter from "./Contactsfilter";
import logo from '../assets/Group 15.svg';
export default function Contacts({contacts,changeChat,changegroupchat,unseenmsglist }) {

  const [currentSelected, setCurrentSelected] = useState(undefined);
  const isMobile = useMediaQuery({ query: '(max-width: 400px)' });
  const [query,setquery]=useState(null);

  const changeCurrentChat = (contact) => {
    setquery(null);
    document.getElementById('contacts-search-input').value='';
    setCurrentSelected(contact._id);
    if(contact.isgroup===true)
    {changeChat(null);changegroupchat(contact);}
    else{
      changeChat(contact);changegroupchat(null);
    }
   
  };
  const handlechange=(e)=>{
    if(e.target.value){
      setquery(e.target.value);
    }
    else setquery(null);
  }
  return (
    <>
       
        <div className="contacts-container" id="contacts-container-mobile">
          <div className="contacts-heading-wrapper">
          <div className="contacts-heading">
            <img src={logo} width={'115px'}></img>
          </div>
          <div className="contacts-search">
            <img src={searchblackicon}></img><input placeholder="search your contacts..." id="contacts-search-input" onChange={handlechange}/>
          </div>  
          </div>
          {
          query===null?
          <div className="contacts">
          
            {contacts?.length<1?<div className="contacts-notfound"><img src={nocontacts} width={'200px'} height={'200px'}></img>No Contacts Found</div>:
            contacts.map((contact) => {
              return (
                <div
                  key={contact._id}
                  className={`${
                    contact._id=== currentSelected ? "selected" : ""
                  } contact`}
                >
                  <div className="contacts-avatar">
                    {contact.isgroup?<GrpsProfilePicture item={contact} style={2}></GrpsProfilePicture>:<UsersProfilePicture item={contact} style={2}></UsersProfilePicture>}
                  </div>
                  <div onClick={() => {changeCurrentChat(contact)}} style={{width:'100%',height:'100%',display:'flex',alignItems:'center'}}>
                  <div style={{marginLeft:'20px'}}>
                  <div className="contacts-username">
                    {contact.isgroup?contact.name:contact.username}
                  </div>
                  <div className="recent-message" style={{fontSize:'0.6rem',color:'gray'}}>
                    {contact.recentMessage?contact.recentMessage.message?(contact.recentMessage.message.text.length>30?contact.recentMessage.message.text.substring(0,30)+'...':contact.recentMessage.message.text):(contact.recentMessage.text.length>30?contact.recentMessage.text.substring(0,30)+'...':contact.recentMessage.text):""}
                  
                    </div>
                  </div>
                  <div style={{fontSize:'0.7rem',color:'gray',position:'absolute',right:'15px'}}>
                    <span>{contact.recentMessage ? String(new Date(contact.recentMessage.createdAt).getHours()).padStart(2, '0') + ":" + String(new Date(contact.recentMessage.createdAt).getMinutes()).padStart(2, '0'):""}</span>
                    <br/>{( unseenmsglist[contact._id]!==undefined && unseenmsglist[contact._id]!==0) && <span style={{background:'#00e676',borderRadius:'50%',color:'white',width:'20px',height:'20px',display:'flex',justifyContent:'center',alignItems:'center'}}>{unseenmsglist[contact._id]}</span>}
                    </div>
                    </div>
                </div>
              );
            })}
          </div>:<Contactsfilter currentSelected={currentSelected} unseenmsglist={unseenmsglist} query={query} contacts={contacts} changeCurrentChat={changeCurrentChat}></Contactsfilter>
            }
         {isMobile&& <Bottombar></Bottombar>}
        </div>
        
    </>
  );
}
