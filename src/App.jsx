import { useState } from 'react'
import React from 'react'
import './App.css'
import { ZIM } from 'zego-zim-web';

function App() {
 
const [zimInstance,setZimInstance] = useState(null);
const [userinfo,setUserinfo] = useState(null);
const [messageText,setMessageText] = useState("");
const [messages,setMessages] = useState([]);
const [selectedUser,setSelectedUser] = useState(null);
const [isLoggedIn,setIsLoggedIn] = useState(false);
const appID = 1593047580;
const tokenA="04AAAAAGnFPs8ADEiKIvvxsRvsZGuPpwCw1pM9uUXoy24RKPR/EqirFqbbZtcQ+I2f22DTQQaEldbbKMf9wQ/3bo1ttG13dFz3wzjxjQSvb7xB/eFHK5cLWQ6RfR5+2ssEvkx6MsGUjTxjTp6M5I6DOY0ZyZP4yIgwdUZzey3N4hR2+s80I6rfT+5VSkP8C+ym4UGGvhBvVzLWuHdWSKmdlRFV3HD7Ng8FW/81UmX7//Gg5pn7f7icXVK9Gpx9CGU1EbUTHXhAlXoB";
const tokenB="04AAAAAGnFPw0ADB45H/OUdoKnh0ggbQCv8PwmxmZKTDki9n7No2UQkqBUmlYidwyFDHPUfTkyX2plLsOzPSUz2UuU/7wTsiPaWHL42ZphNrOG7R3raMyFJZ1qnQw/8jkZB4x+n3NaFrcs4s/NqVy/bp8X/xor9fjrMiiX1RZxVcjrubycycryiEbR/AxesFgi7QA0a4AWy5TsL35cLTLYNm014ikF1WMzJMacJAXkAZHinXYPhg6QkRywcBQyeN+t+1o5FpTeFwE=";

useEffect(()=>{
const instance=ZIM.create({appID});
setZimInstance(instance);
instance.on('error', function (zim, errorInfo) {
    console.log('error', errorInfo.code, errorInfo.message);
});
},[])


  return (
    <div>
    </div>
  )
}

export default App
