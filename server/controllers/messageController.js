const Messages = require("../models/messageModel");
const Group=require("../models/groupModel");
const User=require("../models/userModel");
const GroupMessages= require("../models/grpMsgModel");
const GrpInviteNotif=require("../models/grpinvitenotif");
const friendrequestnotif = require("../models/friendrequestnotif");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
  
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ createdAt: 1 });
  
    const projectedMessages = await Promise.all(messages.map(async(msg,index) => {
      const sender=await User.findOne({_id:msg.sender});
      const reply=await Messages.findOne({_id:msg.replyfor});
      const replysender=await User.findOne({_id:reply?.sender});
      const replyfor=replysender?{messageid:reply._id,sender:replysender.username,senderid:replysender._id,message:reply.message.text}:null;
      return {
        messageid:msg._id,
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        timestamp:msg.createdAt,
        seen:msg.seen,
        sender:sender.username,
        senderid:sender._id,
        replyfor:replyfor,
        
      };
    }));
    res.json(projectedMessages);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message,replyfor } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      replyfor:replyfor
    });

    if (data) return res.json({ msg: "Message added successfully." ,messageid:data._id});
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.addGrpMessage=async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const grp=await Group.findOne({_id:to});
    if(grp.members.includes(from)){
     
    const result=await GroupMessages.create({text:message,sender:from,group:to})
    if (result) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database"});
    }
    else {return res.json({status:401});}
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};
module.exports.getGrpMessages = async (req, res, next) => {
  try {
    const {from,to} = req.body;
   
    let messages= await GroupMessages.find({
     group:to
    });
   
   
    const projectedMessages =await Promise.all( messages.map(async(msg) => {
    
      let senderobj=await User.findOne({_id:msg.sender}).select(['username','profileImage']);
      let sendername=senderobj?.username;
      let senderprofilepic=senderobj?.profileImage;
      senderprofilepic=senderprofilepic?senderprofilepic:null;
      return {
        fromSelf: msg.sender && msg.sender.toString() === from,
        message: msg.text,
        sender:sendername,
        timestamp:msg.createdAt,
        senderprofilepic:senderprofilepic
        // seen:msg.seen
      };
    }));
  return  res.json({projectedMessages:projectedMessages});
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};

module.exports.getNotifications=async(req,res,next)=>{
  let data=await GrpInviteNotif.find({reciever:req.params.id}).sort({createdAt:-1});
  let data2=await friendrequestnotif.find({reciever:req.params.id}).sort({createdAt:-1});
  data=await Promise.all(data.map(async(item)=>{
    const user=await User.findOne({_id:item.sender});
    const grp=await Group.findOne({_id:item.grpinviteid});
    return {isgrpinvite:true,grpdetails:{_id:grp._id,name:grp.name,profileImage:grp.profileImage?grp.profileImage:null},_id:item._id,senderdetails:{_id:user._id,username:user.username,profileImage:user.profileImage?`http://192.168.141.45:5000/uploads/${user.profileImage}`:null}};
  }));
  data2=await Promise.all(data2.map(async(item)=>{
    const user=await User.findOne({_id:item.sender});
    return {isfriendrequest:true,sender:item.sender,_id:item._id,senderdetails:{_id:user._id,username:user.username,profileImage:user.profileImage?user.profileImage:null}};
  }));
  res.json([...data,...data2]);
}