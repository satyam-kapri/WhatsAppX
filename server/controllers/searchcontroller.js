const User=require('../models/userModel');
const FriendRequestsNotif=require('../models/friendrequestnotif');
module.exports.searchfriends=async(req,res,next)=>{
    
    let query=req.query.q;
    const escapeRegex = (text) => {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      };
      query=escapeRegex(query);
    let data=await User.find({_id:{$ne: req.userid}, 
        $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ] });
  
    data=await Promise.all(data.map(async(e)=>{
       
        let status=0;
        let friendreq=await FriendRequestsNotif.findOne({sender:req.userid,reciever:e._id});
        if(friendreq)status=2;
        else if(e.friends.includes(req.userid))status=1;
      
        return {username:e.username,_id:e._id,profileImage:e.profileImage?e.profileImage:null,status:status};
    }));
  
    res.json(data);
}
module.exports.getuserprofiledetails=async(req,res,next)=>{
    
    let data=await User.findOne({_id:req.params.id});
    res.json({_id:data._id,username:data.username,profileImage:data.profileImage?data.profileImage:null})
}

