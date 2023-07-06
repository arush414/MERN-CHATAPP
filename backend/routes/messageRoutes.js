const express= require('express');

const{protect}= require("../middleware/authmiddleware");
const{sendMessage,allMessages}=require("../controllers/messageControllers");
const router= express.Router();



router.route('/').post(protect,sendMessage);// post a chat to a grp/user
router.route('/:chatId').get(protect,allMessages)// get all messages for that corresponding chats

module.exports=router;