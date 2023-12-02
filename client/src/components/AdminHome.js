import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";
import Dispute from "./Dispute";
import { useAuth } from "../AuthContext";

const AdminHome = (props) => {
  const { user } = props;
  const [state, setState] = useState("general");
  const [adminState, setAdminState] = useState("");
  const [users_list, setUsersList] = useState([]);
  const [viewingP, setViewingP] = useState(0);

  const { priv, setPriv, use, setUse, dcma, setDcma, token, setToken } =
    useAuth();

  const [lpriv, setlPriv] = useState(priv);
  const [luse, setlUse] = useState(use);
  const [ldcma, setlDcma] = useState(dcma);

  useEffect(() => {
    console.log("refresh called");
  }, []);
  useEffect(() => {
    console.log("users list", users_list);
  }, [users_list]);

  async function getUsers() {
    setAdminState("users");
    try {
      const response = await fetch(`/api/users/users_list`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
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
        `/api/users/admin-user/${id}/${Number(!status)}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
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
        `/api/users/disable-user/${id}/${Number(!status)}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
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

  return (
    <div>
      <h2>{state == "admin" ? <>Admin Tools</> : <>Hero Management</>}</h2>
      <button
        value="admin"
        style={{
          backgroundColor: state === "admin" ? "rgb(153,80,153)" : "",
          fontWeight: state === "admin" ? "bold" : "normal",
        }}
        onClick={(e) => setState(e.target.value)}
      >
        Admin Tools
      </button>
      <button
        value="general"
        style={{
          backgroundColor: state === "general" ? "rgb(153,80,153)" : "",
          fontWeight: state === "general" ? "bold" : "normal",
        }}
        onClick={(e) => setState(e.target.value)}
      >
        Hero Management
      </button>
      <div>
        {state == "admin" ? (
          <>
            <button
              value="users"
              style={{
                backgroundColor:
                  adminState === "users" ? "rgb(20,204,204)" : "",
                fontWeight: adminState === "users" ? "bold" : "normal",
              }}
              onClick={getUsers}
            >
              {" "}
              Manage Users{" "}
            </button>
            {user.id == 108 ? (
              <>
                <button
                  value="policies"
                  style={{
                    backgroundColor:
                      adminState === "policies" ? "rgb(20,204,204)" : "",
                    fontWeight: adminState === "policies" ? "bold" : "normal",
                  }}
                  onClick={(e) => setAdminState(e.target.value)}
                >
                  Manage Policies{" "}
                </button>
                <button
                  value="dcma"
                  style={{
                    backgroundColor:
                      adminState === "dcma" ? "rgb(20,204,204)" : "",
                    fontWeight: adminState === "dcma" ? "bold" : "normal",
                  }}
                  onClick={(e) => setAdminState(e.target.value)}
                >
                  {" "}
                  DCMA Management{" "}
                </button>{" "}
              </>
            ) : (
              <></>
            )}
            {adminState == "users" ? (
              <>
                {users_list !== null && users_list !== undefined && (
                  <ul>
                    {users_list.map((user) => (
                      <li key={user.userID}>
                        {" "}
                        ID:{user.userID}, Nickname: {user.nName}, Email:{" "}
                        {user.email}
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
            {adminState == "policies" ? (
              <>
                <h2>Privacy Policy</h2>
                <input
                  type="text"
                  onChange={(e) => setlPriv(e.target.value)}
                  maxlength="2000"
                ></input>
                <button id="privacyPolicy" onClick={() => setPriv(lpriv)}>
                  {" "}
                  Submit Edits{" "}
                </button>
                <h2>Use Policy</h2>
                <input
                  type="text"
                  maxlength="2000"
                  onChange={(e) => setlUse(e.target.value)}
                ></input>
                <button
                  id="usePolicy"
                  maxlength="2000"
                  onClick={() => setUse(luse)}
                >
                  Submit Edits
                </button>
                <h2>DCMA Policy</h2>
                <input
                  type="text"
                  maxlength="2000"
                  onChange={(e) => setlDcma(e.target.value)}
                ></input>
                <button id="dcmaPolicy" onClick={() => setDcma(ldcma)}>
                  Submit Edits
                </button>
              </>
            ) : (
              <></>
            )}
            <br />
            {adminState == "dcma" ? (
              <>
                <br />
                <h2>DCMA Management </h2>
                <button
                  onClick={() => {
                    setViewingP(!viewingP);
                  }}
                >
                  {viewingP ? <>Close</> : <> View Take Down Procedure</>}
                </button>
                {viewingP ? (
                  <>
                    <h3> DMCA Notice & Takedown</h3>
                    <p>
                      1. A document that describes the workflow for implementing
                      DMCA notice & takedown policy is provided for the SM.
                    </p>
                    <p>
                      2. This document contains the instructions for using the
                      tools provided for implementing the DMCA notice & takedown
                      policy.{" "}
                    </p>
                  </>
                ) : (
                  <></>
                )}
                <Dispute />
              </>
            ) : (
              <></>
            )}
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
