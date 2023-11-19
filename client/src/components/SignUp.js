import React from 'react';
import {useState} from 'react';


const SignUp = ({onSignup}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function addUser(){
    // if(past_lists(listName.trim())){

    const newUser = {
      fname: "n",
      lName: "c",
      email: username,
      password:password    
    };
    const send = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(newUser), // Convert the object to a JSON string
    };
  
    fetch('/api/users/add-user', send)
      .then((response) => {
        if (response.status === 409) {
          // List name already exists on the server
          alert('List name already exists on the server.');
        }else if (response.status === 200){
            console.log(200)
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log('Response data:', data);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error('Error:' + error);
        // Handle any other errors that occur during the request
      });

    }


    const handleSignup = () => {
    // Validate login details (you can add your own validation logic here)
        if (username && password) {
        // Send login details to the parent component
        addUser()
        onSignup({username, password});

        } else {
        alert('Please enter both username and password.');
        }
    };


    return(
        <div className='login'>
            <span>
            Email: <input type="text" id="email" onChange={(e) => setUsername(e.target.value)}/><br/>
            Password: <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}/>
            </span>
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    )
}

export default SignUp;