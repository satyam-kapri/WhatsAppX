const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    replyfor:{
       type:mongoose.Schema.Types.ObjectId,ref:"Messages" ,default:null
    },
    seen:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
  
);
MessageSchema.index({ 'message.text': 'text' });
module.exports = mongoose.model("Messages", MessageSchema);