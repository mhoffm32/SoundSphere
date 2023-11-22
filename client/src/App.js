import Header from './components/Header'
import {useState, useEffect} from 'react'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Info from './components/Info'
import Home from './components/Home'
import User from './User'
import './App.css';

//Page header will change to login/logout and site info
function App() {
  
  const [state, setState] = useState("DEF");
  const [current_user, setCurrentUser] = useState(null);
  //const [current_user, setUser] = useState("")

  const handleState = (state1) => {
    setState(state1)
  }

  const handleUser = (user) => {
    setCurrentUser(user);
  }

  function onLoginClick(){
    setState("login");
  }

  function onInfoClick(){
    setState("info");
  }

  const handleSignup = (res) => {
    setState(res.state);
    setCurrentUser(res.user);
    console.log("state: " + res.state)
    console.log("user: ", current_user)
  }

  if(state == "loggedin"){
    console.log("user loggedin: " + current_user)
  }

  return (
    <div>
      <button onClick={onLoginClick}>LOGIN</button>
      <button onClick={onInfoClick}>INFO</button>
      {state == "info" ? <Info choice ={handleState}/> : <></>}
      {state == "login" ? <Login setUser={handleUser} setState={handleState} />: <></>}
      {state == "signup" ? <SignUp onSignup={handleSignup}/>: <></>}
      {state == "loggedin" ? <Home user = {current_user}/> : <></>}
    </div>
  )
}

export default App;
/*


import {useEffect,useState} from 'react'
import React from 'react'


function App() {

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api/hero/").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
        console.log(backendData)
      }
    )
  },[])

  return(
    <div>
      {(typeof backendData === "undefined") ? (
      <p>Loading...</p> 
      ) : (
        backendData.map((hero, i) => (<p key={i}>{hero.name}</p>))
        )}
    </div>
  )
}

export default App*/