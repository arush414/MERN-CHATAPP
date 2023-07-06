import "./App.css";
import {  Route } from 'react-router-dom';

import Homepage from './Pages/Homepage';
import Chatpage from './Pages/ChatPage';
import { ToastContainer } from "react-toastify";


function App() {
  return (
   
    <div className="App">

<ToastContainer />
          <Route exact path="/" component={Homepage} />
          <Route path="/chats" component={Chatpage} />
       
        
    </div>
  );
}

export default App;
