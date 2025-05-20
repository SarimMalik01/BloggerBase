
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const Context = createContext();


export const Provider = ({ children }) => {
  const [user,setUser]=useState(
    {
   "username":null,
   "userId":null
    }
  )
  
 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user', {
        withCredentials: true, 
      });

      console.log(response.data); 
      const data=response.data;
      setUser({
        "username":data.userName,
        "userId":data.userId
      })
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err.message);
    }
  };

  fetchData();
}, []);
   

  useEffect(()=>{
   console.log(user)
  },[user])
  
  return (
  <Context.Provider value={{ username: user.username, userId: user.userId,setUser }}>

      {children}
    </Context.Provider>
  );
};

export default Context;
