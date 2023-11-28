import React, { useEffect, useState } from 'react'
import '../css/contactscontainer.css';
import UsersProfilePicture from "./UsersProfilePicture";
import GrpsProfilePicture from "./GrpsProfilePicture";
import nocontacts from '../assets/4780235.webp';
function Contactsfilter({contacts,changeCurrentChat,query,currentSelected,unseenmsglist}) {
    const [newcontacts,setnewcontacts]=useState([]);
  useEffect(()=>{
    let arr=contacts.filter((c)=>{
        if(c.isgroup)return c.name?.toLowerCase().includes(query.toLowerCase());
       return c.username?.toLowerCase().includes(query.toLowerCase());
    })
    setnewcontacts(arr);
  },[query])
  return (
    <div className="contacts">
    {newcontacts.length<1?<div className="contacts-notfound"><img src={nocontacts} width={'200px'} height={'200px'}></img>No Contacts Found</div>:
    newcontacts.map((contact) => {
     
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
  </div>
  )
}

export default Contactsfilter
