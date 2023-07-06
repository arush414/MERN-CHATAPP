import { VStack } from '@chakra-ui/layout';
import { FormControl,FormLabel } from '@chakra-ui/form-control';
import { Input,InputGroup,InputRightElement } from '@chakra-ui/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React,{useState} from 'react';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const Login = ()=>{
    const [show,setShow]= useState(false);
    
    const [email,setEmail]= useState();
    const [password,setPassword]= useState();
    const [picLoading, setPicLoading] = useState(false);
    const history=useHistory();
    
    const handleClick= ()=> setShow(!show);
   
    const submitHandler= async() =>{
        setPicLoading(true);
        if(!email || !password ){
            toast(
                "Please Fill all the Fields",{
               position: "bottom-right",
              type: "warning",
              autoClose: 3000,
              closeOnClick: true,
               theme: "dark",
             });
             setPicLoading(false);
             return ;
        }
       
        try{
           const config={
            headers:{
            "Content-type": "application/json",
           },
        };
        const {data} = await axios.post("/api/user/login",{email,password},
        config);
        toast("Login Successful",{
            position: "top-center",
            type: "success",
            autoClose: 3000,
            closeOnClick: true,
             theme: "colored",
        });
        localStorage.setItem('userInfo',JSON.stringify(data));
        
        setPicLoading(false);
        
        history.push('/chats');
        } catch(error){
            toast("Oops Error Occured!",{
                position: "top-center",
                type: "error",
                autoClose: 3000,
                closeOnClick: true,
                 theme: "dark", 
            });
            setPicLoading(false);
        }
        };
        
    return (
        <VStack spacing='5px'>
      
    

     <FormControl id="email" isRequired='true' >
      <FormLabel > Email</FormLabel>
     <Input  placeholder='Enter Your Email' value={email} onChange={(e)=>{
     setEmail(e.target.value)
     }}>
     </Input>
     </FormControl>
    
    
     <FormControl id="password" isRequired='true'>
      <FormLabel> Password</FormLabel>
      <InputGroup>
    <Input  
    type={show ? 'text' : 'password'}
    placeholder='Enter Your Password' 
    value={password}
    onChange={(e)=>{
     setPassword(e.target.value)
     }}>
     </Input>
     <InputRightElement width={"4.5rem"}>
     <Button h="1.5rem" size={"sm"}
     onClick={()=>{
        handleClick();
     }}>
      {show ? "Hide" : "Show"}
     </Button>
    
     </InputRightElement>
    
     </InputGroup> 
     </FormControl>
    
    
     
    <Button
    width={"100%"}
    colorScheme={"whatsapp"}
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading={picLoading}
    >
    
    Login
    
    </Button>
    <Button 
    width={"100%"}
    variant={"solid"}
    colorScheme={"red"}
    onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456");
    }}
     isLoading={picLoading}>

        Get Guest User Credentials
    </Button>
        </VStack>
    )
    

};
export default Login;