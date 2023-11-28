const mongoose = require("mongoose");

const grpmsgSchema = new mongoose.Schema(
  {
   text:{type:String},
   group:{type:mongoose.Schema.Types.ObjectId,ref:'Group'},
   sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users',default:null},
   isSystemMessage: { type: Boolean, default: false },
   seenby:{type:Map,of:Boolean,default:{"system":true}},
  }
  ,{timestamps:true}
  );
  
  module.exports= mongoose.model('GroupMessages', grpmsgSchema);