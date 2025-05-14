import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";
import Home from "./Home";
import Dispute from "./Dispute";
import { useAuth } from "../AuthContext";

const AdminHome = (props) => {
  const { user } = props;
  const [state, setState] = useState("general");
  const [adminState, setAdminState] = useState("");
  const [users_list, setUsersList] = useState([]);
  const [viewingP, setViewingP] = useState(0);
  const [pText, setPtext] = useState("");
  const [uText, setUtext] = useState("");
  const [dText, setDtext] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [warningText, setWarning] = useState("");

  const { priv, setPriv, use, setUse, dcma, setDcma, token, setToken } =
    useAuth();

  const [lpriv, setlPriv] = useState(priv);
  const [luse, setlUse] = useState(use);
  const [ldcma, setlDcma] = useState(dcma);

  useEffect(() => {
    setPtext("");
    setDtext("");
    setUtext("");
  }, [state, adminState]);

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

  const setPriv1 = () => {
    setPriv(lpriv);
    setPtext("Privacy & Security Policy successfully changed.");
  };
  const setUse1 = () => {
    setUse(luse);
    setUtext("Acceptable Use Policy successfully changed.");
  };
  const setDcma1 = () => {
    setDcma(ldcma);
    setDtext("DCMA Notice & Takedown Request Policy successfully changed.");
  };

  return (
    <div className="content2">
      {state != "pass" ? (
        <div>
          <h2 id="info-title">
            {state == "admin" ? <>Admin Tools</> : <>Hero Management</>}
          </h2>
          <div className="button-box">
            <button
              className="default-btn"
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
              className="default-btn"
              value="general"
              style={{
                backgroundColor: state === "general" ? "rgb(153,80,153)" : "",
                fontWeight: state === "general" ? "bold" : "normal",
              }}
              onClick={(e) => setState(e.target.value)}
            >
              Hero Management
            </button>
          </div>

          {state == "admin" ? (
            <>
              <div className="button-box">
                <button
                  value="users"
                  className="default-btn"
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
                <button
                  value="policies"
                  className="default-btn"
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
                  className="default-btn"
                  style={{
                    backgroundColor:
                      adminState === "dcma" ? "rgb(20,204,204)" : "",
                    fontWeight: adminState === "dcma" ? "bold" : "normal",
                  }}
                  onClick={(e) => setAdminState(e.target.value)}
                >
                  {" "}
                  DCMA Management{" "}
                </button>
              </div>
              {adminState == "users" ? (
                <>
                  {users_list !== null && users_list !== undefined && (
                    <ul>
                      {users_list.map((user) => (
                        <li key={user.userID}>
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
                                onClick={(e) =>
                                  accountStatus(e.target.value, 1)
                                }
                              >
                                Enable Account
                              </button>
                            ) : (
                              <button
                                value={user.userID}
                                id="red"
                                onClick={(e) =>
                                  accountStatus(e.target.value, 0)
                                }
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
                  <textarea
                    id="p-input"
                    type="text"
                    defaultValue={priv}
                    onChange={(e) => setlPriv(e.target.value)}
                    maxLength="2000"
                  ></textarea>
                  <br />
                  <button
                    className="admin-sbmt submit-btn"
                    id="privacyPolicy"
                    onClick={() => setPriv1(lpriv)}
                  >
                    Submit Edits
                  </button>
                  <span style={{ marginLeft: "10px" }}>{pText}</span>
                  <br />
                  <h2>Use Policy</h2>
                  <textarea
                    id="p-input"
                    type="text"
                    maxLength="2000"
                    defaultValue={use}
                    onChange={(e) => setlUse(e.target.value)}
                  ></textarea>
                  <br />
                  <button
                    id="usePolicy"
                    className="admin-sbmt submit-btn"
                    maxLength="2000"
                    onClick={() => setUse1(luse)}
                  >
                    Submit Edits
                  </button>
                  <span style={{ marginLeft: "10px" }}>{uText}</span>
                  <br />
                  <h2>DCMA Policy</h2>
                  <textarea
                    defaultValue={dcma}
                    type="text"
                    maxLength="2000"
                    id="p-input"
                    onChange={(e) => setlDcma(e.target.value)}
                  ></textarea>
                  <br />
                  <button
                    className="admin-sbmt submit-btn"
                    id="dcmaPolicy"
                    onClick={() => setDcma1(ldcma)}
                  >
                    Submit Edits
                  </button>
                  <span style={{ marginLeft: "10px" }}>{dText}</span>
                </>
              ) : (
                <></>
              )}
              <br />
              {adminState == "dcma" ? (
                <>
                  <br />
                  <h2 id="info-title">DCMA Management </h2>
                  <button
                    className="dmca-btn submit-btn"
                    onClick={() => {
                      setViewingP(!viewingP);
                    }}
                  >
                    {viewingP ? <>Close</> : <> View Take Down Procedure</>}
                  </button>
                  {viewingP ? (
                    <>
                      <h3> DMCA Notice & Takedown Procedure</h3>
                      <ol
                        style={{ margin: "0", padding: "0 0 0 1em" }}
                        className="instructions"
                      >
                        <li>
                          1. Upon receiving a DMCA claim, hide the alleged
                          infringing review. This can be done by navigating to
                          “public lists” under “hero management”, finding the
                          list containing the infringing review, opening the
                          review section, and clicking the button labeled “Mark
                          as Infringing” to hide the review from all non-admin
                          users.
                        </li>
                        <li>
                          2. Use the logging form down below to log the
                          infringement claim by including the date that the
                          claim was received, the details & location of the
                          infringing claim, and optional notes.
                        </li>
                        <li>
                          <p>
                            3. Email the contributor of alleged infringing
                            material to notify them of their infringing review.
                            After sending the email, please log the infringement
                            notice sent down below. Please use the template
                            provided below: <br />
                            <br />
                            Dear [creator nickname], I am writing to bring to
                            your attention a serious matter concerning the
                            Digital Millennium Copyright Act (DMCA) infringement
                            related to the material you have contributed to our
                            platform. We have received a formal DMCA takedown
                            request regarding your content, specifically
                            identified as [Review location and details]. We
                            would like to inform you that the review in question
                            has been removed for the time being and will be
                            revisited upon further action from the claimant. You
                            may submit a counter-notice if you believe your
                            review contained no infringing material, or you can
                            wait for your review to be reinstated if it’s found
                            to be not infringing. Multiple infringement claims
                            on HeroWorld may result in serious consequences,
                            including account termination and legal action.
                            Thank you for your cooperation. [your name],
                            HeroWorld.
                          </p>
                        </li>
                        <li>
                          4. If the contributer decides to submit a
                          counter-notice, inform the claimant of the counter
                          notice details.{" "}
                        </li>
                        <li>
                          5.If the claimant has not taken further action within
                          14 days of the initial infringement claim, find the
                          list of containing the review and click “unhide”.
                        </li>
                      </ol>
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminHome;
