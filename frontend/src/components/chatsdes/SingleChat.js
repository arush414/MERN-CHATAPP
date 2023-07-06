import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull,isSameSender,isLastMessage} from "../../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import { Text } from "@chakra-ui/react";
import UpdateGroupChatModal from "./UpdateGroupModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import './styles.css';
import Lottie from "lottie-react";
import animationsloading from "../../Animation/type.json";


import io from 'socket.io-client';
const ENDPOINT = "http://localhost:3000";
var socket,selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat, notification,setNotification  } = ChatState();
  const [socketConnected,setSocketConnected]=useState(false);
  const[typing,setTyping]= useState(false);
  const[isTyping,setIsTyping]=useState(false);
  const [timerId, setTimerId] = useState(null);

  const fetchMessages= async() =>{
    if(!selectedChat){return ;}
    try{
        const config = {
            headers: {

              Authorization: `Bearer ${user.token}`,
            },
          };
          setLoading(true);
        
          const {data}= await axios.get(`/api/message/${selectedChat._id}`,
          config);
          
          setMessages(data);
          setLoading(false);
          console.log(selectedChat);
          console.log(selectedChat._id);
          socket.emit('join_chat',selectedChat._id);


    }catch{

        toast({
            title: "Error Occured",
            description: "Failed to fetch the message",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });

    }
  };
 
// fetch messages again when user change the chat
useEffect(()=>{
  socket= io(ENDPOINT);
  socket.emit("setup",user);
  socket.on('connected',()=>{
      setSocketConnected(true)
  });
  socket.on("typing",()=>setIsTyping(true));
  socket.on("stop_typing",()=>setIsTyping(false));
},[]);

  useEffect(()=>{
fetchMessages();
selectedChatCompare=selectedChat;
  },[selectedChat]);

useEffect(()=>{
  socket.on('message_recieved',(newMessageRecieved)=>{
   if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id ){
    if(!notification.includes(newMessageRecieved)){
      setNotification([newMessageRecieved, ...notification]);
      setFetchAgain(!fetchAgain);
    }
    
   }
   else{
    setMessages([...messages,newMessageRecieved]);
   }
  });
})

const sendMessage = async (event) => {

    if (event.key === "Enter" && newMessage) {
      socket.emit("stop_typing",selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log("single chat ka data....");
        console.log(data);
        socket.emit("new_message",data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send the message",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
     if(!socketConnected){return ;}

     if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);

     }

     // when to stop typing
     const timerLength = 4000;

        if (timerId) {
            clearTimeout(timerId);
        }

        let timer = setTimeout(() => {
            socket.emit("stop_typing",      selectedChat._id);
               setTyping(false);

        }, timerLength);

        setTimerId(timer);



  };



  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            textAlign={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {" "}
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div display="flex"  >
                <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
  <Box display="flex">
    {isTyping && (
      <Box marginRight={2}>
        <Lottie
          animationData={animationsloading}
          loop={true}
          width={30}
        />
      </Box>
    )}
    <Input
      placeholder="Enter Message"
      bg={"#E0E0E0"}
      variant={"filled"}
      onChange={typingHandler}
      value={newMessage}
    />
  </Box>
</FormControl>

          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user or group to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
