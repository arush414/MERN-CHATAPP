const express= require("express")
const app =express();
app.use(express.json()); // to accept json files incoming
const {chats}= require("./data/data");
const path = require('path')
require('dotenv').config({path:path.resolve(__dirname,'./.env')})
const connectDB = require("./config/db");
const colors= require('colors');
const userRoutes= require('./routes/userRoutes');
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
const {  notFound,errorHandler } = require("./middleware/errormiddleware");
connectDB();


const PORT=process.env.PORT || 3000;


app.get("/",(req,res)=>{
    res.send("Api is running");
});



app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);


const server=app.listen(3000,()=>{
    console.log(`Server started on Port ${PORT}`.blue.bold);
})

const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  });
  
  io.on("connection", (socket) => {
    console.log('Connected to socket.io');
    //frontend will send us data and we will join the room
    socket.on('setup',(userData)=>{
       socket.join(userData._id);
       console.log(userData._id);

       socket.emit('connected');
    });

    socket.on('join_chat',(room)=>{
        socket.join(room);
        console.log('User joined room '+ room);
    });

    socket.on("typing",(room)=> socket.in(room).emit("typing"))
    socket.on("stop_typing",(room)=> socket.in(room).emit("stop_typing"))
    socket.on('new_message',(newMessageRecieved)=>{
           var chat= newMessageRecieved.chat;
           
           if(!chat.users){return console.log("chat users not defined");}

           chat.users.forEach((user) => {
            if(user._id== newMessageRecieved.sender._id){return ;}
            socket.in(user._id).emit("message_recieved",newMessageRecieved);
           });
    })
  });
  
  
  
  
  
  