const getSender = (loggedUser,users)=>{
return  users[0]._id=== loggedUser._id ? users[1].name : users[0].name;
};


const getSenderFull= (loggedUser,users)=>{
    return  users[0]._id=== loggedUser._id ? users[1] : users[0];
};
// m is curr message 
// i is index of curr message
const isSameSender = (messages, m, i, userId) => {
    if (!messages || messages.length <= i || !m || !m.sender) {
      return false;
    }
  
    const nextMessage = messages[i + 1];
  
    if (nextMessage && nextMessage.sender && nextMessage.sender._id) {
      return (
        nextMessage.sender._id !== m.sender._id && m.sender._id !== userId
      );
    }
  
    return false;
  };
  
  const isLastMessage = (messages, i, userId) => {
    if (!messages || messages.length <= i) {
      return false;
    }
  
    const lastMessage = messages[messages.length - 1];
  
    if (
      lastMessage &&
      lastMessage.sender &&
      lastMessage.sender._id &&
      lastMessage.sender._id !== userId
    ) {
      return i === messages.length - 1;
    }
  
    return false;
  };
  const isSameSenderMargin = (messages, m, i, userId) => {
    if (!messages || messages.length <= i || !m || !m.sender) {
      return 'auto';
    }
  
    const nextMessage = messages[i + 1];
    const currentSender = m.sender._id;
  
    if (nextMessage && nextMessage.sender && nextMessage.sender._id) {
      const nextSender = nextMessage.sender._id;
  
      if (currentSender === nextSender && currentSender !== userId) {
        return 33;
      } else if (
        (currentSender !== nextSender && currentSender !== userId) ||
        (i === messages.length - 1 && currentSender !== userId)
      ) {
        return 0;
      }
    }
  
    return 'auto';
  };

  const isSameUser = (messages,m,i)=>{
    return i>0 && messages[i-1].sender._id===m.sender._id;
  }
  
  
export  {getSender,getSenderFull,isSameSender,isLastMessage,isSameSenderMargin,isSameUser};
