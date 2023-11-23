import React from 'react';
import {useState,useEffect} from 'react';
/*
ADMIN FEATURES 
- 
*/

const AdminHome = (props) => {
    const { user } = props;
    const [state,setState] = useState("list-users")
    const [users_list, setUsersList] = useState([])
    const [refresh, setRefresh] = useState("")

    useEffect(() => {
        console.log("refresh called")
    }, []);

    useEffect(() => {
        console.log("users list",users_list)

    }, [users_list]);

    async function getUsers() {
        try {
            const response = await fetch(`/api/users/users_list`);
            const data = await response.json();
            setUsersList(data)

            if(response.status == 200){
                let list = data.users.filter((e) => e.userID !== 108);
                console.log(list)
                setUsersList(list);

                return data;
            } else if (response.status == 404){
                return 404;
            }else if (response.status == 500){
                return 500;
            }

        } catch (error) {
            console.error("Error occured:", error);
            return null; // or handle the error in a way that makes sense for your application
        }
    }

    const adminStatus = async (id,status) => {
    
        try {
            const response = await fetch(`/api/users/admin-user/${id}/${Number(!status)}`);
    
            if (!response.ok) {
                console.error(`Request failed with status ${response.status}: ${response.statusText}`);
            } else {
            }
        } catch (error) {
            console.error('Error:', error.message);
        }

    }

    const accountStatus = async (id) => {
        let userID = id;
        console.log(userID)

    }

    const list_users = async () => {
        let res = await getUsers()
    }


  return (
    <div>
      <h2>Welcome Admin User</h2>
        <div>
            <button value= "list-users" onClick= {getUsers} > List Users </button>
            {state == "list-users" ? <>
            <button value= "refresh" onClick = {getUsers}> refresh </button>
            {users_list !== null && users_list !== undefined && (
                <ul>
                    {users_list.map(user => (
                    <li key={user.userID}> ID:{user.userID}, Nickname: {user.nName}, Email: {user.email}, Password: {user.password}
                    <div id="user-btns">
                    {user.admin ? (<button value={user.userID} id="red" onClick={(e) => adminStatus(e.target.value,1)}> Remove Admin privilige</button> ) : 
                    (<button value = {user.userID} id="green" onClick={(e) => adminStatus(e.target.value,0)}> Grant Admin privilige</button>)}
                    {user.disabled ? (<button value={user.userID} id="green" onClick={(e) => accountStatus(e.target.value,1)}>Enable Account</button> ): 
                    (<button value = {user.userID} id="red" onClick={(e) => accountStatus(e.target.value,0)}>Disable Account</button>)}
                    
                    </div>
                    </li>

                    ))}
                </ul>
            )}
            </> : <></>}
    
        </div>
    </div>
  );
}


export default AdminHome;