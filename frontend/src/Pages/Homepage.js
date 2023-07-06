import React, { useEffect } from 'react';
import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
 
  } from "@chakra-ui/react";

  import Login from '../components/Authentication/Login';
  import Signup from '../components/Authentication/Signup';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';



const Homepage= ()=>{
  const history= useHistory();
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  },[history]);
  
    return(
    <Container maxW="xl" centerContent>

    <Box 
    d='flex'
    justifyContent='center'
    p={5}
    w="100%"
    bg={'whiteAlpha.500'}
    m="50px 0 30px 0"
    borderRadius="lg"
    borderWidth="1px"

    >
     <Text fontSize='4xl' fontFamily='Work sans' textAlign='center'> TALKRIFIC</Text>
    </Box>
    <Box
    bg="white" w="100%" p={4} borderRadius={"xl"} borderWidth="1px" color={"black"}
    >
    <Tabs variant='soft-rounded' colorScheme='whatsapp'>
  <TabList mb={"1em"}>
    <Tab width={"50%"}>Login</Tab>
    <Tab width={"50%"}>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      {<Login/>}
    </TabPanel>
    <TabPanel>
     {<Signup/>}
    </TabPanel>
  </TabPanels>
</Tabs>
   
        
    </Box>
    </Container>

    )
}
export default Homepage;
