import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, 
    ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import { GrAdd } from "react-icons/gr";
import axios from 'axios';
import UserListItem from './ListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({children})=>{
    const {isOpen,onOpen,onClose}= useDisclosure();
    const [groupChatName,setGroupChatName]= useState("");
    const [selectedUsers,setSelectedUsers]= useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const toast= useToast();

    const {user,chats,setChats}= ChatState();

  const handleSearch= async (query)=>{
         setSearch(query);
         if(!query){
          return;
         }
         try{
             setLoading(true)
             const config={
              headers:{
                Authorization:`Bearer ${user.token}`,
              },
             };
             const {data}= await axios.get(`/api/user?search=${search}`,config)
             console.log("handle Search searchResult")
             console.log(searchResult)
             console.log("handle Search data")
             console.log(data);
             setLoading(false);
             setSearchResult(data);

         }catch(error){
              toast({
                title:"Error Occured",
                description:"Failed to Load the Search Result",
                status:"error",
                duration:5000,
                isClosable: true,
                position:"bottom-left",
              });
         }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {

          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log("heyyyy"+groupChatName)
      const { data } = await axios.post(`/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      console.log("submit handle chats")
      console.log(chats);
      console.log("submit handle data")
      console.log(data)
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: "huehue",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleDelete= (delUser)=>{
  setSelectedUsers(selectedUsers.filter((sel)=> sel._id!==delUser._id));
  };


  const handleGroup = (userToAdd)=>{
         if(selectedUsers.includes(userToAdd)){
          toast({
            title:"User is already included",
            status:"warning",
            duration:3000,
            isClosable:true,
            position:"top",
          });
          return ;
         }
         setSelectedUsers([...selectedUsers,userToAdd]);
  }
    return (
        <>
            <Button
        onClick={onOpen}
        display={"flex"}
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        leftIcon={<GrAdd />}
        colorScheme="teal"
      >
        New Group Chat
      </Button>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize={"15px"} fontFamily={"Work sans"} display={"flex"} justifyContent={"center"}>Create Group Chat
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
                <FormControl >
                    <Input placeholder='Chat Name' mb={3} onChange={(e)=> setGroupChatName(e.target.value)}>
                  
                    </Input>
                </FormControl>
                <FormControl >
                    <Input placeholder='Add Users' mb={3} onChange={(e)=> handleSearch(e.target.value)}>
                  
                    </Input>
                    {console.log("loading")}
                { console.log(loading)}
                 {console.log("searchResult")}
                { console.log(searchResult)}
                </FormControl>
 <Box w="100%" display={"flex"} flexWrap={"wrap"}>
                {selectedUsers.map((u)=>(
                  <UserBadgeItem key={u._id}
                  user={u}
                    handleFunction={ ()=>{
                    return handleDelete(u);
                  }}
                  />
                ))}
                </Box>
                {loading? (<div>loading</div>) : (
                  searchResult?.slice(0,4).map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                  ))
                )}


              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={1} onClick={handleSubmit}>
                 Create Chat
                </Button>
              
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    };


export default GroupChatModal;