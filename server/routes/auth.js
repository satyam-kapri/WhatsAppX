const {
    login,
    register,
    getAllUsers,
    logOut,
    getprofiledetails}=require("../controllers/usercontroller");
 const{uploadprofilepic}=require("../controllers/picturecontroller");
  const {validatejwt, checkloggedInorNot}=require('../middleware/authmiddleware');
  const router = require("express").Router();
  const {upload}=require('../middleware/profilepicmiddleware');
  router.post("/login", login);
  router.post("/register", register);
  router.get("/allusers/:id", validatejwt,getAllUsers);
  router.get("/logout", logOut);
  router.post("/uploadprofilepic",validatejwt,upload.single('profilePic'),uploadprofilepic);
  router.get("/getprofiledetails",validatejwt,getprofiledetails);
  router.get('/checkloggedInorNot',checkloggedInorNot);
  module.exports= router;