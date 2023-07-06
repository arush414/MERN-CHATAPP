import { VStack } from '@chakra-ui/layout';
import { FormControl,FormLabel } from '@chakra-ui/form-control';
import { Input,InputGroup,InputRightElement } from '@chakra-ui/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React,{useState} from 'react';
import { Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';




const Signup = ()=>{
const [show,setShow]= useState(false);
const [name,setName]= useState();
const [email,setEmail]= useState();
const [password,setPassword]= useState();
const [confirmpassword,setConfirmpassword]= useState();
const [pic,setPic]= useState();
const [picLoading, setPicLoading] = useState(false);
const history=useHistory();
const handleClick= ()=> setShow(!show);


const postDetails = (pics)=> {
    setPicLoading(true);
    if(pics===undefined){
        toast(
            "Please Select an Image!",{
            position: "bottom-right ",
            type: "warning",
            autoClose: 3000,
            closeOnClick: true,
            theme: "dark",
          });
          return;
    }
    console.log(pics);

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
        toast(
            "Please Select an Image!",{
           position: "bottom-right",
          type: "warning",
          autoClose: 3000,
          closeOnClick: true,
           
           theme: "dark",
         });
        setPicLoading(false);
        return;
      }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data =new FormData();
      data.append("file", pics);
      data.append("upload_preset", "wf6qd5nh");
      
      axios.post("https://api.cloudinary.com/v1_1/dldtdqzct/image/upload",data)
      .then((response) => {
        console.log("Cloudinary response:", response);
        setPic(response.data.url.toString());
        console.log(response.data.url.toString());
        setPicLoading(false);
        toast("Image uploaded successfully!", {
          type: "success",
          position: "bottom-right",
          duration: 5000,
          closeOnClick: true,
          theme: "light",
        });
      })
      .catch((err) => {
        console.log(err);
        setPicLoading(false);
      });
    
    } 
};



const submitHandler= async() =>{
setPicLoading(true);
if(!name || !email || !password || !confirmpassword){
  console.log('fill all fields')
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
if(password!==confirmpassword){
  console.log('Passwords Do Not Match')
    toast(
        "Passwords Do Not Match",{
       position: "bottom-right",
      type: "error",
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
const {data} = await axios.post("/api/user",{name,email,password,pic},
config);
toast("Registration Successful",{
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
  <FormControl id="first-name" isRequired='true' >
  <FormLabel> Name</FormLabel>
 <Input  placeholder='Enter Your Name' onChange={(e)=>{
 setName(e.target.value)
 }}>
 </Input>
 </FormControl>


 <FormControl id="email" isRequired='true' >
  <FormLabel > Email</FormLabel>
 <Input  placeholder='Enter Your Email' onChange={(e)=>{
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


 <FormControl id="password" isRequired='true'>
  <FormLabel> Confirm Password</FormLabel>
  <InputGroup>
<Input  
type={show ? 'text' : 'password'}
placeholder='Confirm password' 
onChange={(e)=>{
 setConfirmpassword(e.target.value)
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

<FormControl id="pic">
<FormLabel> Upload your Picture</FormLabel>
<Input
type="file"
p={1.5}
accept="image/*"
onChange={(e)=> postDetails(e.target.files[0])}
></Input>
</FormControl>
<Button
width={"100%"}
colorScheme={"whatsapp"}
style={{marginTop:15}}
onClick={submitHandler}
isLoading={picLoading}
>

Submit

</Button>
    </VStack>
)


};
export default Signup;