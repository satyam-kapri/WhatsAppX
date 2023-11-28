const { grpinvite,getgrpdetails} = require("../controllers/grpopsController");
const {uploadgrpprofilepic}=require('../controllers/picturecontroller');
const {upload}=require('../middleware/profilepicmiddleware');
const router = require("express").Router();
  
router.post("/grpinvite",grpinvite);
router.get("/getgrpdetails/:id",getgrpdetails);
router.post("/uploadgrpprofilepic",upload.single('profilePic'),uploadgrpprofilepic);
module.exports = router;