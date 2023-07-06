import { ChatState } from "../Context/ChatProvider"; 
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/chatsdes/ChatBox";
import MyChats from "../components/chatsdes/MyChats";
import SideDrawer from "../components/chatsdes/SideDrawer";
import { useState } from "react";
import { ChatProvider } from "../Context/ChatProvider";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", height: "570px" }}>
      {user && <SideDrawer/>}
      <Box w="100%" h="91vh" p={'12px'}
      display={"flex"} justifyContent={"space-between"}
      >
        {user && <MyChats fetchAgain={fetchAgain}  />}
        { user && (
          <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
  this is in chatpage.js
    </div>
  );
};

const ChatPage = () => (
  <ChatProvider>
    <Chatpage />
  </ChatProvider>
);

export default ChatPage;