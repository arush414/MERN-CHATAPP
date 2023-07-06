const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data sent by user");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message
      .populate("sender", "name pic")
      .populate("chat")
      .execPopulate();
    
    message = await User.populate(message, {
      path: "chat.users",
      select: "-password",
    });
    
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    
    res.json(message);
    
  } catch (error) {
    res.status(400);
    throw new Error(error.message+"tatti");
  }
});
const allMessages = asyncHandler(async (request, response) => {
  try {
    const messages = await Message.find({
      chat: request.params.chatId,
    })
      .populate("sender", "-password")
      .populate("chat");
    response.json(messages);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };