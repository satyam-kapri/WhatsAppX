const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isgroup:{
    type:Boolean,
    default:false
  },
  profileImage:{
    type:String,
    default:null
  }
  ,friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
});
userSchema.index({ username: 'text' ,email:'text'});
module.exports = mongoose.model("Users", userSchema);