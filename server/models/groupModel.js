const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], 
    isgroup:{type:Boolean,default:true},
    admin:{type:mongoose.Schema.Types.ObjectId,ref:"Users",default:null},
    profileImage:{type:String,default:null}
  }
  ,{timestamps:true}
  );
  
  module.exports= mongoose.model('Group', groupSchema);