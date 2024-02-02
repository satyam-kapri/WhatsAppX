
const Group= require("../models/groupModel");
const User = require("../models/userModel");
const Messages=require("../models/messageModel");
const bcrypt = require("bcrypt");
const GroupMessages=require("../models/grpMsgModel");
const jwt=require('jsonwebtoken');

//-----------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const token=jwt.sign({userid:user._id},process.env.JWT_SECRET);
    res.cookie('token',token,{httpOnly:true,secure:true,
      expires: new Date(Date.now() + 900000000),
      sameSite:'None'
      });
   
   
   return res.json({ status: true});
  } catch (ex) {
    next(ex);
  }
};
//-----------------------------------------------------------------------------------------------

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    const token=jwt.sign({userid:user._id},process.env.JWT_SECRET);
    res.cookie('token',token,{httpOnly:true,secure:true,
      expires: new Date(Date.now() + 900000000),
      sameSite:'None'
      });
    
    
    return res.json({ status: true });
  } catch (ex) {
    next(ex);
  }
};
//-----------------------------------------------------------------------------------------------

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id },friends:{$elemMatch:{$eq:req.userid} }}).select([
      "email",
      "username",
      "_id",
      "profileImage"
    ]);
    
       const userswithrecentmessage=await Promise.all(
        users.map(async (contact) => {
          let recentMessage = await Messages.find({
            users: {
              $all: [req.params.id, contact._id.toString()],
            },
          }).sort({ createdAt: -1 }).select(['message.text','createdAt','seen','sender']);

        let unseencount=0,i=0;
        
        while(i < recentMessage.length && recentMessage[i].seen===false && recentMessage[i].sender.toString()!==req.params.id)
        {unseencount++;i++;}
       
        recentMessage=recentMessage[0];
        let isgroup=false;
        
        return {
          ...contact.toObject(),
          recentMessage,
          unseencount,
          isgroup,
          
        };
        
      }));
     
    let grps=await Group.find({members:req.params.id}).select({
      name:'$name',
      _id:'$_id',
      isgroup:'$isgroup',
      profileImage:'$profileImage'
  })
    
    grps=await Promise.all(grps.map(async(grp)=>{
    let grpmessages=await GroupMessages.find({group:grp._id}).sort({createdAt:-1});
    let unseencount=0,i=0;

    while(i<grpmessages.length && grpmessages[i].seenby?.has(req.params.id)===false && grpmessages[i].sender?.toString()!==req.params.id){
      i++;unseencount++;
    }
    
    
   return{
    ...grp.toObject(),recentMessage:grpmessages[0],unseencount:unseencount,
   }
   }))

  
    return res.json([...userswithrecentmessage,...grps]);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};
//-----------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------

module.exports.getprofiledetails=async(req,res,next)=>{
  
  try{
    
 const data= await User.findOne({_id:req.userid});
 
 const newdata={username:data.username,_id:data._id,profileImage:data.profileImage?data.profileImage:null};
 
 return res.json(newdata);}
 catch(err){console.log(err);}
}
//-----------------------------------------------------------------------------------------------

module.exports.logOut = (req, res, next) => {
  try {
    res.clearCookie('token',{secure:true,sameSite:'None'});
    // onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
