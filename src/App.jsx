import { useState, useEffect, useRef } from 'react'
import React from 'react'


import './App.css'
import { ZIM } from 'zego-zim-web';

function App() {
 
const [zimInstance,setZimInstance] = useState(null);
const [userInfo,setUserInfo] = useState(null);
const [messageText,setMessageText] = useState("");
const [messages,setMessages] = useState([]);
const [selectedUser,setSelectedUser] = useState("Milin");
const [isLoggedIn,setIsLoggedIn] = useState(false);

const selectedUserRef = useRef("Milin");
const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const tokenA = import.meta.env.VITE_ZEGO_TOKEN_A;
const tokenB = import.meta.env.VITE_ZEGO_TOKEN_B;
const messageEndRef = useRef(null);


useEffect(() => {
  selectedUserRef.current = selectedUser;
}, [selectedUser]);

useEffect(() => {
  const savedUser = localStorage.getItem('chat_user');
  if (savedUser && (savedUser === "Milin" || savedUser === "Ayush")) {
    setSelectedUser(savedUser);
  }
}, []);

useEffect(()=>{
const instance=ZIM.create({appID});
setZimInstance(instance);

instance.on('error', function (zim, errorInfo) {
    console.error('ZIM Error:', errorInfo.code, errorInfo.message);
});

instance.on('connectionStateChanged', function (zim, { state, event }) {
    console.log('Connection State:', state, event);
    if (state === 0) setIsLoggedIn(false);
});

instance.on('peerMessageReceived', function (zim, { messageList}) {
    console.log('Received Messages:', messageList);
    setMessages((prev)=>[...prev, ...messageList]);
});

instance.on('tokenWillExpire', function (zim, { second }) {
    const currentToken = selectedUserRef.current === "Milin" ? tokenA : tokenB;
    zim.renewToken(currentToken)
        .then(() => console.log("Token renewed success"))
        .catch(err => console.error("Token renew failed", err));
});

return () =>{
  instance.destroy();
}
},[])

useEffect(() => {
  if (messageEndRef.current) {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);


const handleLogin = () => {
  if (!zimInstance) return;

  const info = {
    userID: selectedUser,
    userName: selectedUser,
  };

  const loginToken = selectedUser === "Milin" ? tokenA : tokenB;

  zimInstance.login(info, loginToken)
    .then(function () {
      setUserInfo(info);
      setIsLoggedIn(true);
      localStorage.setItem('chat_user', selectedUser);
      console.log("Logged in as", selectedUser);
    })
    .catch(function (err) {
      console.error("Login failed:", err);
      alert(`Login failed (Error ${err.code}): ${err.message}`);
    });
};

const handleLogout = () => {
  if (zimInstance) {
    zimInstance.logout();
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('chat_user');
  }
};

const handleSendMessage = () => {
  if (!isLoggedIn || !messageText.trim() || !zimInstance) return;

  const toConversationID = selectedUser === "Milin" ? "Ayush" : "Milin";
  const text = messageText;
  
  setMessageText("");

  const conversationType = 0; 
  const config = { priority: 1 };
  const messageObj = {
    type: 1, 
    message: text,
  };

  console.log('Sending message to:', toConversationID, messageObj);

  zimInstance.sendMessage(messageObj, toConversationID, conversationType, config)
    .then(function ({ message }) {
      console.log('Send success:', message);
      setMessages((prev)=>[...prev, message]);
    })
    .catch(function (err) {
      console.error('Send failed:', err);
      setMessageText(text);
      alert(`Failed to send (Error ${err.code}): ${err.message}`);
    });
};

const formatTime = (timeStamp) => {
  const date = new Date(timeStamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <div className="app-container">
      <h1 className="title">Real Time Chat App</h1>
      
      {!isLoggedIn ? (
        <div className="login-screen">
          <h2>Select User</h2>
          <div className="user-selector">
            <select 
              className="user-dropdown"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="Milin">Milin</option>
              <option value="Ayush">Ayush</option>
            </select>
          </div>
          <button className="btn-login" onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="chat-box">
          <div className="chat-header">
            <div style={{display: 'flex', justifyContent: 'center', width: '100%', padding: '0 20px', alignItems: 'center'}}>
                <div>
                   <span>{userInfo.userName}</span> chatting with <span>{selectedUser === 'Milin' ? 'Ayush' : 'Milin'}</span>
                </div>
            </div>
          </div>
          
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-item ${msg.senderUserID === userInfo.userID ? 'sent' : 'received'}`}
              >
                <div className="message-text">{msg.message}</div>
                <div className="message-info">
                  <span className="time">{formatTime(msg.timestamp || Date.now())}</span>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          
          <div className="input-area">
            <input 
              type="text" 
              className="input-field" 
              placeholder="message" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-btn" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App




