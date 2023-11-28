const { addMessage, getMessages,addGrpMessage,getGrpMessages, getNotifications} = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/addgrpmsg",addGrpMessage);
router.post("/getgrpmsg",getGrpMessages);
router.get("/getnotifications/:id",getNotifications);
module.exports = router;