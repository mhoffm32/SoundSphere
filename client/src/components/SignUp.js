import React from 'react';
import {useState, useEffect} from 'react';
import User from "../User.js"


const SignUp = ({onSignup}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [nName, setnName] = useState('');
    const [userID, setUserID] = useState(0);
    const [verificationLink, setVerificationLink] = useState('');
    const [localstate, setstate] = useState('signup')

    useEffect(() => {

      if(localstate){
        let current_user = new User(userID,nName,email,password)
        onSignup({state: localstate, user: current_user})
      }

    }, [userID]);

    const addUser = async () => {

      const newUser = {
        nName: nName,
        email: email,
        password:password,
      };

      const send = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(newUser), // Convert the object to a JSON string
      };

      const response = await fetch('/api/users/add-user', send);

      if (response.status === 409) {
        alert('Account under ' + email + ' already exists.');
      } else if (response.status === 200) {
        alert('Account Added. Please Verify email.');
      } else{
        alert("error: " + response)
      }
      return response.json();
    }

  const handleSignup = async () => {
    // Validate login details (you can add your own validation logic here)
        if (email && password && password2 && nName) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if(!emailRegex.test(email)){
            alert("invalid email format")
          } else {
            if(password === password2){
              const data = await addUser();
              if(data.status == 200){
                setUserID(data.userID);
                setstate("loggedin")
              }
            } else {
              alert("Passwords dont match.")
            }
            }
        } else {
        alert('Please enter email, first name, last name, password.');
        }
    };

    return(
        <div className='signup'>
            <span>
            Email: <input type="text" id="email" onChange={(e) => setEmail(e.target.value)}/><br/>
            Nickname: <input type="text" id="nName" onChange={(e) => setnName(e.target.value)}/><br/>
            Password: <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/><br/>
            Confirm Password: <input type="text" id="password2" onChange={(e) => setPassword2(e.target.value)}/>
            </span>
            <button onClick={handleSignup}>Sign Up</button>
            {verificationLink && (
              <div>
                <p>Verification Link: {verificationLink}</p>
                <p>Copy and paste the link to verify your email.</p>
              </div>
            )} {window.location.search.includes('?hash=') && (
              <div>
                <p>Verifying...</p>

              </div>
            )}

        </div>
    )
}

export default SignUp;