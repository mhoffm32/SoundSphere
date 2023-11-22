import React from 'react';
import {useState} from 'react';
import User from "../User.js"

const Login = ({setUser, setState}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLog = async () => {
        if (email && password) {

            let cUser = await getUser(email)

            let thisuser = new User(cUser.id,cUser.nName,cUser.email,cUser.password)
            
            if (thisuser.activated){
                setUser(thisuser)
                setState("loggedIn")
            }else{
                alert("User account deactivated")
            }

        } else {
            alert('Please enter both username and password.');
        }
    };

    async function getUser(email) {
        try {
              const response = await fetch(`/api/users/users_list/${email}`);
              const data = await response.json();
              return data;

        } catch (error) {
              console.error("Error:", error);
              return null; // or handle the error in a way that makes sense for your application
        }
      }

    return(
        <div className='login'>
            <span>
            Email: <input type="text" id="email" onChange={(e) => setEmail(e.target.value)}/><br/>
            Password: <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/>
            </span>

            <button onClick={handleLog}>Login</button>
        </div>
    )
}

export default Login;