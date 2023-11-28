const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const grpopsRoutes=require("./routes/grpops");
const searchRoutes=require("./routes/search");
const app = express();
const socket = require("socket.io");
const Group=require('./models/groupModel');
const messageModel = require("./models/messageModel");
const GroupMessages=require("./models/grpMsgModel");
const GrpInviteNotif=require("./models/grpinvitenotif");
const User=require("./models/userModel");
const cookieParser=require('cookie-parser');
const {validatejwt}=require('./middleware/authmiddleware');
const friendrequestnotif = require("./models/friendrequestnotif");
require("dotenv").config();


app.use(cors({
  origin: 'http://192.168.141.45:3000',
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages",validatejwt,messageRoutes);
app.use("/api/grpops",validatejwt,grpopsRoutes);
app.use("/api/search",validatejwt,searchRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://192.168.141.45:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
   
  });
socket.on("disconnect",()=>{
  const userId = Array.from(onlineUsers.keys()).find(
    (key) => onlineUsers.get(key) === socket.id
  );

  if (userId) {
    onlineUsers.delete(userId);
    // console.log(`User ${userId} disconnected`);
  }
})
socket.on("send-msg", async(data) => {
  
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      let datatosend={messageid:data.messageid,msg:data.msg,time:data.timestamp,from:data.from,replyto:data.replyfor,senderid:data.senderid,sender:data.sender};
      socket.to(sendUserSocket).emit("msg-recieve", datatosend);
    }
  });
socket.on("seen-message",async({from,to})=>{
  const messages= await messageModel.find({
    users: {
      $all: [from, to],
    },
  }).sort({ createdAt: -1 });
  for (const message of messages) {
    if(message.seen)break;
    if (!message.seen) {
      message.seen = true;
      await message.save();
    }}
    if(onlineUsers.get(from))
    {
      socket.to(onlineUsers.get(from)).emit("message-read");}
})
  socket.on('create-group', async({groupName, userId,username})=>{
    try{
    const newGroup =await Group.create({ name: groupName, members: [userId],admin:userId});
    const newmessage=await GroupMessages.create({text:`${username} created this group`,group:newGroup._id,isSystemMessage:true,sender:null});
        const groupId = newGroup._id;
        socket.join(groupId);
        // socket.emit('group-created', {grpname:newGroup.name,grpid:newGroup._id,msg:`${username} created this group`});
        io.to(onlineUsers.get(userId)).emit("force-rerender");
        
    }
    catch(e){console.log(e);}
  });

  socket.on("send-grp-msg", async(data) => { 
 
    const grp=await Group.findOne({_id:data.to}).select(["members"]);
    const grpusers=grp.members;
    if(grpusers.includes(data.senderid)){
    const senderdet=await User.findOne({_id:data.senderid}).select('profileImage');
    const senderprofilepic=senderdet.profileImage?`http://192.168.141.45:5000/uploads/${senderdet.profileImage}`:null;
    grpusers.forEach((userid)=>{
      const sendUserSocket = onlineUsers.get(userid.toString());
      if (sendUserSocket) {
        let datatosend={msg:data.msg,time:data.timestamp,sender:data.from,from:data.to,profilepic:senderprofilepic};
        socket.to(sendUserSocket).emit("grp-msg-recieve", datatosend);
      }
    })
  }
  });

  socket.on("seen-grp-message",async({from,to})=>{
    const messages=await GroupMessages.find({group:to}).sort({createdAt:-1});
  
    if(messages)
    for (const message of messages) {
      if(!message.seenby)message.seenby={};
      if(message.seenby?.get(from)===true)break;
        message.seenby.set(from,true);
        await message.save();
      }
   
  })
  socket.on("accept-grp-invite",async({itemid,grpid,userid,username})=>{
    try{
     const data=await Group.findOne({_id:grpid});
    
     if(!data.members.includes(userid))
     {const res=await Group.updateOne({_id:grpid},{$push:{members:userid}});
     if(res.modifiedCount>=1){
     await GroupMessages.create({group:grpid,text:`${username} joined the group`,isSystemMessage:true,sender:null});
      data.members.forEach((recieverid)=>{
      const sendUserSocket = onlineUsers.get(recieverid.toString());
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("grp-msg-recieve", {msg:`${username} joined the group`,isSystemMessage:true,from:grpid,time:Date.now(),sender:null});
       
      }
    })
   
     io.to(socket.id).emit("force-rerender");
     await GrpInviteNotif.deleteOne({_id:itemid});
     }
    }
    }catch(err){
      console.log(err);
    }
     
    
     
  })
  socket.on("leave-group",async({grpid,userid,username})=>{
    try{
    const res=await Group.updateOne({_id:grpid},{$pull:{members:userid}});
    if(res.modifiedCount===1){
    await GroupMessages.create({group:grpid,text:`${username} left the group`,isSystemMessage:true,sender:null});
    const data=await Group.findOne({_id:grpid});
    data.members.forEach((recieverid)=>{
      const sendUserSocket = onlineUsers.get(recieverid.toString());
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("grp-msg-recieve", {msg:`${username} left the group`,isSystemMessage:true,from:grpid,time:Date.now(),sender:null});
       
      }
    })
    io.to(socket.id).emit("force-rerender");
    
    }
  }catch(err){console.log(err);}
  });

  socket.on("send-friend-request",async({from,to,username})=>{
    const doc=await friendrequestnotif.findOne({sender:from,reciever:to});
    if(!doc)
    await friendrequestnotif.create({sender:from,reciever:to});

  })
  socket.on("accept-friend-request",async({itemid,userid,senderid})=>{
    await User.updateOne({_id:userid},{$push:{friends:senderid}});
    await User.updateOne({_id:senderid},{$push:{friends:userid}});
    await friendrequestnotif.deleteOne({_id:itemid});
    io.to(socket.id).emit("force-rerender");
    socket.to(onlineUsers.get(senderid.toString())).emit("force-rerender");
  })
  socket.on("kickout-fromgrp",async({userids,grpid,adminid})=>{
   
    const data=await Group.findOne({_id:grpid});
    
    if(data.admin.toString()===adminid){
    await Group.updateOne({_id:grpid},{$pull:{members:{$in:userids}}});
    
    for(let i=0;i<userids.length;i++){
      let user=await User.findOne({_id:userids[i]});
      await GroupMessages.create({group:grpid,text:`${user.username} has been kicked out of the group`,isSystemMessage:true,sender:null});
    
      data.members.forEach((userid)=>{
        const sendUserSocket = onlineUsers.get(userid.toString());
        if (sendUserSocket) {
          let datatosend={msg:`${user.username} has been kicked out of the group`,time:Date.now(),sender:null,isSystemMessage:true,from:grpid};
          io.to(sendUserSocket).emit("grp-msg-recieve", datatosend);
        }
      })
     
      let usersocket=onlineUsers.get(userids[i].toString());
  
      if(usersocket){
      socket.to(usersocket).emit("force-rerender");
      socket.to(usersocket).emit("currgrpchat-forcererender",{grpid:grpid,grpname:data.name});
      }
   
    
    }
   
    io.to(socket.id).emit("memberlist-forcererender");
  }
  })
});