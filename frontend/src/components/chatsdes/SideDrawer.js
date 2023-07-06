import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BellIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import { FcSearch } from "react-icons/fc";
import { FaSearch } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./ListItem";
import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const history= useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()

const logoutHandler = () =>{
    localStorage.removeItem("userInfo");
    history.push("/");
}
const toast= useToast();


const handleSearch = async()=>{
if(!search){
    toast({
        title:"Please enter name or email",
        status:"warning",
        duration: 5000,
        isClosable:true,
        position:"top-left"
    });
    return;
}
try{
    setLoading(true)
    console.log(user);
    const config={
        headers:{
             Authorization:`Bearer ${user.token}`,
        },
    };
   console.log(search)
    const { data } = await axios.get(`/api/user?search=${search}`, config);

    setLoading(false);
    setSearchResult(data);
}catch(error){
    console.log(error)
    toast({
        title:"Error Occured",
        description:error.message,
        status:"error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",

    }); 
}
};

const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };



  return (
    <>
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bgColor={"whitesmoke"}
      w={"100%"}
      p={"5px 10px 5px 10px"}
      borderWidth={"5px"}
    >
      <Tooltip label="Search Users to chat" hasArrow placement="auto-start">
        <Button
          variant="solid"
          color="white"
          bgColor="#1f1f1f"
          borderRadius="full"
          display="flex"
          alignItems="center"
          px={4}
          onClick={onOpen}
          _hover={{ bgColor: "teal.500" }}
          _focus={{ outline: "none" }}
        >
          <FaSearch fontSize="1.2rem" />
          <Text display={{ base: "none", md: "flex" }} ml={2}>
            Search
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"} fontFamily={"Work sans"}>
        TALKRIFIC
      </Text>
      <div>
        <Menu>
          <MenuButton p={"1"}>
            <BellIcon fontSize={"2xl"} m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif)=>(
              <MenuItem key={notif._id} onClick={()=>{
                setSelectedChat(notif.chat)
                setNotification(notification.filter((n)=> n!=notif));
              }}>
                {notif.chat.isGroupChat ?
                `New Message in ${notif.chat.chatName}`
                : `New Message from ${getSender(user,notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList> 
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<TriangleDownIcon />}>
            <Avatar
              size={"sm"}
              cursor={"pointer"}
              name={user.name}
              src={user.pic}
            ></Avatar>
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />

            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>


    <Drawer isOpen={isOpen}
        placement='left'
        onClose={onClose}
        >
    <DrawerOverlay/>
    <DrawerContent>
<DrawerHeader> Search Users</DrawerHeader>
<DrawerBody>
    <Box display={"flex"} pb={2}>
      <Input
      placeholder="Search by name or email"
      mr={2}
      value={search}  
      onChange={(e)=> setSearch(e.target.value)}/>
      <Button onClick={handleSearch}>GO</Button>
    </Box>
    <Box mt="2">
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => accessChat(user._id)}
            />
          ))
        )}
      
      </Box>
      {loadingChat && <Spinner ml="-moz-initial" d="flex" />}
</DrawerBody>
    </DrawerContent>

    




    </Drawer>

    </>
  );
};
export default SideDrawer;
