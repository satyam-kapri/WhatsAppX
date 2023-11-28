const {searchfriends,getuserprofiledetails}=require('../controllers/searchcontroller');
const router = require("express").Router();
router.get('/searchfriends',searchfriends);
router.get('/getuserprofiledetails/:id',getuserprofiledetails);
module.exports=router;