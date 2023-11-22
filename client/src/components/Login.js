import React from 'react';
import {useState, useEffect} from 'react';
import User from "../User.js"

const Login = ({onLogin}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localstate, setstate] = useState('login')
    const [curr_user, setUser] = useState(new User(0,'','',''))

    useEffect(() => {
        
        if(localstate){
          onLogin({state: localstate, user: curr_user})
        }

      }, [localstate]);


    const handleLog = async () => {
        if (email && password) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailRegex.test(email)){
                alert("invalid email format")
            }else{
                let res = await getUser()
                if (res == 404){
                    alert("Invalid Credentials")
                }else if(res == 500 || res == null){
                    alert("An error occured. Please try again.")
                }else {
                    if(res.disabled){
                        alert("Disabled Account. Please contact the site adminstarator for more details.");
                    }else{
                        setUser(new User(res.userID,res.nName,res.email,res.password))
                        setstate("loggedin")
                       
                    }
                }
            }
        } else {
            alert('Please enter both a username and password.');
        }
    };

    async function getUser() {
        try {
              const response = await fetch(`/api/users/get_user/${email}/${password}`);
              const data = await response.json();
              if(response.status == 200){
                return data.user;
              } else if (response.status == 404){
                return 404;
              }else{
                return 500;
              }

        } catch (error) {
              console.error("Error occured:", error);
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