const mongoose = require("mongoose");

const friendrequestnotif = new mongoose.Schema(
  {
  sender:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
  reciever:{type:mongoose.Schema.Types.ObjectId,ref:'Users'},
  seen:{type:Boolean,default:false},
  }
  ,{timestamps:true}
  );
  
  module.exports= mongoose.model('FriendRequestsNotif', friendrequestnotif);