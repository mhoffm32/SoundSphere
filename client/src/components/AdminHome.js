import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";
/*
ADMIN FEATURES 
- 
*/

const AdminHome = (props) => {
  const { user } = props;
  const [state, setState] = useState("general");
  const [adminState, setAdminState] = useState("users");
  const [users_list, setUsersList] = useState([]);
  const [refresh, setRefresh] = useState("");

  useEffect(() => {
    console.log("refresh called");
  }, []);

  useEffect(() => {
    console.log("users list", users_list);
  }, [users_list]);

  async function getUsers() {
    setAdminState("users");
    try {
      const response = await fetch(`/api/users/users_list`);
      const data = await response.json();
      setUsersList(data);

      if (response.status == 200) {
        let list = data.users.filter((e) => e.userID !== 108);
        console.log(list);
        setUsersList(list);

        return data;
      } else if (response.status == 404) {
        return 404;
      } else if (response.status == 500) {
        return 500;
      }
    } catch (error) {
      console.error("Error occured:", error);
      return null; // or handle the error in a way that makes sense for your application
    }
  }

  const adminStatus = async (id, status) => {
    try {
      const response = await fetch(
        `/api/users/admin-user/${id}/${Number(!status)}`
      );

      if (!response.ok) {
        console.error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      } else {
        console.log("Admin status changed");
        getUsers();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const accountStatus = async (id, status) => {
    try {
      const response = await fetch(
        `/api/users/disable-user/${id}/${Number(!status)}`
      );

      if (!response.ok) {
        console.error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      } else {
        console.log("Account Status changed");
        getUsers();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const list_users = async () => {
    let res = await getUsers();
  };

  return (
    <div>
      <h2>{state == "admin" ? <>Admin Tools</> : <>Hero Management</>}</h2>
      <button value="admin" onClick={(e) => setState(e.target.value)}>
        Admin Tools
      </button>
      <button value="general" onClick={(e) => setState(e.target.value)}>
        Hero Management
      </button>
      <div>
        {state == "admin" ? (
          <>
            <button value="refresh" onClick={getUsers}>
              {" "}
              View Users{" "}
            </button>
            <button value="logs" onClick={(e) => setAdminState(e.target.value)}>
              {" "}
              View Logs{" "}
            </button>
            <button value="dcma" onClick={(e) => setAdminState(e.target.value)}>
              {" "}
              DCMA Management{" "}
            </button>
            {adminState == "users" ? (
              <>
                {users_list !== null && users_list !== undefined && (
                  <ul>
                    {users_list.map((user) => (
                      <li key={user.userID}>
                        {" "}
                        ID:{user.userID}, Nickname: {user.nName}, Email:{" "}
                        {user.email}, Password: {user.password}
                        <div id="user-btns">
                          {user.admin ? (
                            <button
                              value={user.userID}
                              id="red"
                              onClick={(e) => adminStatus(e.target.value, 1)}
                            >
                              {" "}
                              Remove Admin privilige
                            </button>
                          ) : (
                            <button
                              value={user.userID}
                              id="green"
                              onClick={(e) => adminStatus(e.target.value, 0)}
                            >
                              {" "}
                              Grant Admin privilige
                            </button>
                          )}
                          {user.disabled ? (
                            <button
                              value={user.userID}
                              id="green"
                              onClick={(e) => accountStatus(e.target.value, 1)}
                            >
                              Enable Account
                            </button>
                          ) : (
                            <button
                              value={user.userID}
                              id="red"
                              onClick={(e) => accountStatus(e.target.value, 0)}
                            >
                              Disable Account
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <></>
            )}
            {adminState == "logs" ? <>logs</> : <></>}
            {adminState == "dcma" ? <>DCMA</> : <></>}
          </>
        ) : (
          <></>
        )}
        {state == "general" ? (
          <>
            <UnauthHome user={user} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
