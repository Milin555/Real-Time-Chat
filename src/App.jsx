import { useState } from 'react'
import React from 'react'


import './App.css'
import { ZIM } from 'zego-zim-web';

function App() {
 
const [zimInstance,setZimInstance] = useState(null);
const [userInfo,setUserInfo] = useState(null);
const [messageText,setMessageText] = useState("");
const [messages,setMessages] = useState([]);
const [selectedUser,setSelectedUser] = useState(Milin);
const [isLoggedIn,setIsLoggedIn] = useState(false);
const appID = 1593047580;
const tokenA="04AAAAAGnFPs8ADEiKIvvxsRvsZGuPpwCw1pM9uUXoy24RKPR/EqirFqbbZtcQ+I2f22DTQQaEldbbKMf9wQ/3bo1ttG13dFz3wzjxjQSvb7xB/eFHK5cLWQ6RfR5+2ssEvkx6MsGUjTxjTp6M5I6DOY0ZyZP4yIgwdUZzey3N4hR2+s80I6rfT+5VSkP8C+ym4UGGvhBvVzLWuHdWSKmdlRFV3HD7Ng8FW/81UmX7//Gg5pn7f7icXVK9Gpx9CGU1EbUTHXhAlXoB";
const tokenB="04AAAAAGnFPw0ADB45H/OUdoKnh0ggbQCv8PwmxmZKTDki9n7No2UQkqBUmlYidwyFDHPUfTkyX2plLsOzPSUz2UuU/7wTsiPaWHL42ZphNrOG7R3raMyFJZ1qnQw/8jkZB4x+n3NaFrcs4s/NqVy/bp8X/xor9fjrMiiX1RZxVcjrubycycryiEbR/AxesFgi7QA0a4AWy5TsL35cLTLYNm014ikF1WMzJMacJAXkAZHinXYPhg6QkRywcBQyeN+t+1o5FpTeFwE=";
const messageEndRef = useRef(null);

useEffect(()=>{
const instance=ZIM.create({appID});
setZimInstance(instance);
instance.on('error', function (zim, errorInfo) {
    console.log('error', errorInfo.code, errorInfo.message);
});

instance.on('connectionStateChanged', function (zim, { state, event }) {
    console.log('connectionStateChanged', state, event);
   
});

instance.on('peerMessageReceived', function (zim, { messageList}) {
    setMessages((prev)=>[...prev,messageList]);
});

instance.on('tokenWillExpire', function (zim, { second }) {
    console.log('tokenWillExpire', second);
    
    zim.renewToken(selectedUser==="Milin"?tokenA:tokenB)
        .then(function(){
            console.log("token renewed successfully");
            
        })
        .catch(function(err){
            console.log(err);
            
        })
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
  const info = {
    userID: selectedUser,
    userName: selectedUser === "Milin" ? "Milin" : "Ayush",
  };

  setUserInfo(info);

  const loginToken = selectedUser === "Milin" ? tokenA : tokenB;

  if (zimInstance) {
    zimInstance
      .login(info, loginToken)
      .then(function () {
        setIsLoggedIn(true);
        console.log("logged in");
      })
      .catch(function (err) {
        console.log("login failed");
      });
  } else {
    console.log("instance error");
  }
};

const handleSendMessage = () => {
  if (!isLoggedIn) return;

  const toConversationID =
    selectedUser === "Milin" ? "Ayush" : "Milin";

  const conversationType = 0;

  const config = {
    priority: 1,
  };

  var messageTextObj = {
    type: 1,
    message: messageText,
    extendedData: "",
  };
  zimInstance.sendMessage(messageTextObj, toConversationID, conversationType, config)
    .then(function ({ message }) {
      setMessages((prev)=>[...prev,message]);
      
    })
    .catch(function (err) {
      console.log(err);
    });

    setMessageText("");
};

const formatTime = (timeStamp) => {
  const date = new Date(timeStamp);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};



  return (
    <div>
    </div>
  )
}

export default App
