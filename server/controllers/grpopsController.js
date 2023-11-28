const Group= require("../models/groupModel");
const GrpInviteNotif=require("../models/grpinvitenotif");
const FriendRequestsNotif=require('../models/friendrequestnotif');
const User = require("../models/userModel");
// const fs = require('fs');
// const path = require('path');
module.exports.grpinvite=async(req,res,next)=>{
    try{
const {fromuser,grpid,invitationarr}=req.body;

invitationarr.forEach(async(inviteuser)=>{
  const not=await GrpInviteNotif.create({reciever:inviteuser._id,sender:fromuser,grpinviteid:grpid,isgrpinvite:true});
  
})
res.status(200).send();
    }
    catch(ex){
res.status(500).send();
    }

}
module.exports.getgrpdetails=async(req,res,next)=>{
    try{
        const data=await Group.findOne({_id:req.params.id});
        const members=await Promise.all(data.members.map(async(m)=>{
         const user=await User.findOne({_id:m});
         let status=0;
         let friendreq=await FriendRequestsNotif.findOne({sender:req.userid,reciever:user._id});
         if(friendreq)status=2;
         else if(user.friends.includes(req.userid))status=1;
         return {_id:user._id,username:user.username,profileImage:user.profileImage?user.profileImage:null,status:status}
        }));
      
        res.json({_id:data._id,grpname:data.name,members:members,profileImage:data.profileImage?data.profileImage:null,admin:data.admin});

    }
    catch(err){console.log(err);}
}
// module.exports.uploadgrpprofilepic=async(req,res,next)=>{
  
//    try{
   
//     const grp=await Group.findOne({_id:req.body._id});
//     if(req.file && req.userid===grp.admin.toString()){
    
//   const uploadsDirectory = path.join(__dirname,'..', 'uploads');
//   let previousImageFilename=grp.profileImage;
//   if ( previousImageFilename!==null && fs.existsSync(path.join(uploadsDirectory, previousImageFilename))) {
//     fs.unlinkSync(path.join(uploadsDirectory, previousImageFilename));
   
//   }
//  await Group.updateOne({_id:req.body._id},{profileImage:req.file.filename});
//  res.status(200).json({pic:`http://192.168.141.45:5000/uploads/${req.file.filename}`});
// }
// }catch(err){console.log(err);return res.status(500).send();}
// }