import Header from './components/Header'
import {useState} from 'react'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Info from './components/Info'
import User from './User'
import './App.css';

//Page header will change to login/logout and site info
function App() {

  const [state, setState] = useState("DEF");
  const [current_user, setUser] = useState("");

  const handleState = (choice) => {
    setState(choice)
  }

  const handleUser = (user) => {
    setUser(user)
  }

  function onLoginClick(){
    setState("login");
    console.log("called on loginclick");
  }

  function onInfoClick(){
    setState("info");
    console.log("called on infologinclick");
  }

  const handleSignup = (details) => {
    console.log(details)
    let found = 0;
    if (found==1){
      console.log("")
    }else{

    }
  }

  return (
    <div>
      <button onClick={onLoginClick}>LOGIN</button>
      <button onClick={onInfoClick}>INFO</button>
      {state == "info" ? <Info choice ={handleState}/> : <></>}
      {state == "login" ? <Login setUser={handleUser} setState={handleState} />: <></>}
      {state == "signup" ? <SignUp onSignup={handleSignup}/>: <></>}
      {state == "loggedIn" ? <Info choice ={handleState}/> : <></>}
    </div>
  )
}

export default App;
