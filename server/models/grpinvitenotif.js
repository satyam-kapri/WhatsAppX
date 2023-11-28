const mongoose = require("mongoose");

const GrpInviteNotif = mongoose.Schema(
  {
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"Users",required:true},
    reciever:{type:mongoose.Schema.Types.ObjectId,ref:"Users",required:true},
    seen:{type:Boolean,default:false},
    grpinviteid:{type:mongoose.Schema.Types.ObjectId,ref:"Group"},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GrpInviteNotif", GrpInviteNotif);