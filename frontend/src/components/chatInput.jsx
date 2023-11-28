import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import EmojiPicker from "emoji-picker-react";
import '../css/chatinput.css';
import CancelIcon from '@mui/icons-material/Cancel';
export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputopen,setinputopen]=useState(false);
  const [wrapperstyle,setwrapperstyle]=useState({borderRadius:'50%',width:'40px'});
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {
    let message = msg;
    message += event.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const handleopeninput=()=>{
    setinputopen(true);
    setwrapperstyle({width:'83%'});
  }
 const closeinput=()=>{
  setinputopen(false);
  setwrapperstyle({width:'40px'});
 }
  return (
    <>
    <div className="input-wrapper" style={wrapperstyle}>
      {!inputopen?<div onClick={handleopeninput}><KeyboardIcon sx={{color:'white',cursor:'pointer'}}></KeyboardIcon></div>:
        <>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <EmojiPicker width={'274px'} height={'391px'} emojiStyle={{size:'30px'}} onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button className="send-btn" type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48"><path fill="#5cc697" d="M7.262 4.244c-1.787-.893-3.765.812-3.146 2.711L8.13 19.26a2 2 0 0 0 1.573 1.352l15.86 2.643c.835.14.835 1.34 0 1.48L9.704 27.378a2 2 0 0 0-1.573 1.352L4.116 41.042c-.62 1.9 1.359 3.605 3.146 2.712l35.494-17.742c1.659-.83 1.659-3.197 0-4.026L7.262 4.244Z"/></svg>
        </button>
      </form>
      </>
}
    </div>
   { inputopen && <CancelIcon onClick={closeinput} sx={{cursor:'pointer'}}></CancelIcon>}
    </>
  );
}
