import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, useToast } from "@chakra-ui/react";
import axios from "axios";
import { Stack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { Text } from "@chakra-ui/react";
import { getSender } from "../../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain}) => {
    const [loggedUser,setLoggedUser]= useState();
    const {selectedChat,setSelectedChat,user,chats,setChats}= ChatState();
    const toast= useToast();
    const fetchChats = async() =>{
        console.log(user._id);
        try{
            const config= {
                headers:{
                    Authorization : `Bearer ${user.token}`,

                },
            };
            const {data} = await axios.get("/api/chat",config);
            setChats(data);
            console.log("data");
            console.log(data);
            console.log(".........................")
        }catch(error){
            toast({
                title:"Error Occured",
                description:"Failed to load the Chats",
                status:"error",
                duration:3000,
                isClosable:true,
                position: "bottom-left",

            });
        }
    };
    useEffect(()=>{
        console.log(localStorage.getItem("userInfo"));
        console.log("..................................")
           setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
           fetchChats();

    }, [fetchAgain])
    return (
        <>
          <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={"column"}
            alignItems={"center"}
            p={3}
            bgColor={"white"}
            w={{ base: "100%", md: "31%" }}
            borderRadius={"lg"}
            borderWidth={"1px"}
          >
            <Box
              px={3}
              pb={3}
              fontSize={{ base: "28px", md: "30px" }}
              display={"flex"}
              width={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              My Chats
              <GroupChatModal>
              

              </GroupChatModal>
            </Box>
    
            <Box
              display={"flex"}
              flexDir={"column"}
              p={3}
              w={"100%"}
              bg={"#F8F8F8"}
              h={"100%"}
              borderRadius={"lg"}
              overflowY={"hidden"}
            >
              {chats ? (
                <Stack overflowY={"scroll"}>
                  {chats.map((chat) => (
                    <Box
                      onClick={() => {
                        setSelectedChat(chat);
                      }}
                      cursor={"pointer"}
                      bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                      color={selectedChat === chat ? "white" : "black"}
                      px={3}
                      py={2}
                      borderRadius={"lg"}
                      key={chat._id}
                    >
                      <Text>
                        {chat.isGroupChat === false
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <ChatLoading/>
              )}
            </Box>
          </Box>
        </>
      );
    };
    
    export default MyChats;