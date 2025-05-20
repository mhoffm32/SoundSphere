import React from "react";
import { useState, useEffect } from "react";
import UnauthHome from "./UnauthHome";
import { useAuth } from "../AuthContext";

const SavedLists = (props) => {
  const [expandedResults, setExpandedResults] = useState([]);
  const [expandedHeroes, setExpandedHeroes] = useState([]);
  const [heroLists, setLists] = useState();
  const [reviewsExpanded, setReviewsExpanded] = useState([]);
  const [newListName, setnewListName] = useState("");
  const [heroIDs, setheroIDs] = useState([]);
  const [description, setDes] = useState("");
  const [isPublic, setPublic] = useState(0);
  const [alertText, setAlertText] = useState("");
  const [isEditing, setEdit] = useState(0);
  const [editIndex, setEditIndex] = useState(0);
  const [field, setField] = useState("ListName");
  const [changeValue, setChangeValue] = useState("");
  const [editWarning, setEditWarning] = useState("");
  const { token, setToken } = useAuth();
  const [isConfirmVis, setConfirmVis] = useState(false);

  const user = props.user ? props.user : false;

  const toggleExpansion = (index) => {
    if (expandedResults.includes(index)) {
      setExpandedResults(
        expandedResults.filter((expandedIndex) => expandedIndex !== index)
      );
    } else {
      setExpandedResults([...expandedResults, index]);
    }
  };

  const toggleExpansionHeroes = (listIndex, heroIndex) => {
    const heroIdentifier = `${listIndex}-${heroIndex}`;
    if (expandedHeroes.includes(heroIdentifier)) {
      setExpandedHeroes(
        expandedHeroes.filter((expandedHero) => expandedHero !== heroIdentifier)
      );
    } else {
      setExpandedHeroes([...expandedHeroes, heroIdentifier]);
    }
  };

  const toggleReviews = (listIndex) => {
    setReviewsExpanded((prevReviewsExpanded) =>
      prevReviewsExpanded === listIndex ? null : listIndex
    );
  };

  useEffect(() => {
    getLists();
  }, []);

  useEffect(() => {
    setEditWarning("");
    setField("ListName");
    setChangeValue("");
  }, [isEditing]);

  const getLists = async () => {
    try {
      const response = await fetch(
        `/api/express/lists/saved-lists/${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      //const response = await fetch(`/api/express/lists/saved-lists/${user.id}`);
      const lis = await response.json();

      if (!response.ok) {
        console.error(
          `Request to fetch lists failed with status ${response.status}: ${response.statusText}`
        );
      } else {
        console.log("lists:", lis);
        setLists(lis);
      }
    } catch (error) {
      console.error("Error fetching Public Lists:", error.message);
    }
  };

  const newList = async () => {
    setAlertText("");

    console.log("heroIDs when adding:", heroIDs);

    if (heroIDs.some(isNaN) || heroIDs.length == 0) {
      setAlertText(`Please enter HeroIDs in the form: 1,2,3`);
      return;
    }

    let dne = [];
    for (let id of heroIDs) {
      if (id > 733) {
        dne.push(id);
      }
    }

    if (dne.length > 1) {
      setAlertText(`Heroes with ID's ${dne} do not exist.`);
      return;
    } else if (dne.length > 0) {
      setAlertText(`Hero with ID ${dne} does not exist.`);
      return;
    }

    if (newListName === "") {
      setAlertText("Please enter a valid list name");
      return;
    } else {
      if (heroLists) {
        if (heroLists.length >= 20) {
          setAlertText(
            "You have 20 lists already. Please delete one to add another"
          );
          return;
        }
        for (let list of heroLists) {
          if (
            list.ListName.toLowerCase().trim() ==
            newListName.toLowerCase().trim()
          ) {
            setAlertText(`List named '${newListName}' already exists`);
            return;
          }
        }
      }
    }

    try {
      const newList = {
        userID: user.id,
        listName: newListName,
        heroIDs: heroIDs,
        nickname: user.nName,
        ratings: [],
        description: description,
        public: Number(isPublic),
      };

      const send = {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newList),
      };

      const response = await fetch("/api/express/lists/new-list", send);
      const res = await response.json();

      if (!response.ok) {
        console.error(
          `Request to add new list failed with ${response.status}: ${res.message}`
        );
        console.log("res", res);
      } else {
        console.log("all good");
        console.log(res);
        getLists();
      }
    } catch (error) {
      console.error("Error adding new list.", error.message);
    }
  };

  const deleteList = async (list) => {
    setConfirmVis(false);
    const response = await fetch(
      `/api/express/lists/delete-list/${user.id}/${list.ListName}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );

    const res = await response.json();

    try {
      if (!response.ok) {
        console.error(
          `Request to delete list failed with ${response.status}: ${res.message}`
        );
        console.log("res", res);
      } else {
        console.log(res);
        getLists();
      }
    } catch (error) {
      console.error("Error adding new list.", error.message);
    }
  };

  const submitEdit = async (list) => {
    let editWarning = "";
    setEditWarning("");
    let id = list.id;
    let name = list.ListName;

    if (field === "heroes") {
      if (changeValue.some(isNaN) || changeValue.length == 0) {
        setEditWarning(`Please enter HeroIDs in the form: 1,2,3`);
        return;
      }

      let dne = [];

      for (let id of changeValue) {
        if (id > 733) {
          dne.push(id);
        }
      }

      if (dne.length > 1) {
        setEditWarning(`Heroes with ID's ${dne} do not exist.`);
        return;
      } else if (dne.length > 0) {
        setEditWarning(`Hero with ID ${dne} does not exist.`);
        return;
      }
    } else if (field === "ListName") {
      if (changeValue === "") {
        setEditWarning("Please enter a valid list name");
        return;
      } else {
        if (heroLists) {
          for (let l of heroLists) {
            if (
              l.ListName.toLowerCase().trim() ===
                changeValue.toLowerCase().trim() &&
              l.id !== list.id
            ) {
              setEditWarning(`List named '${changeValue}' already exists`);
              return;
            }
          }
        }
      }
    }

    const edits = {
      id: id,
      name: name,
      field: field,
      value: changeValue,
    };

    const send = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edits),
    };

    const response = await fetch("/api/express/lists/edit-list", send);

    const res = await response.json();

    try {
      if (!response.ok) {
        console.error(
          `Request to edit list failed with ${response.status}: ${res.message}`
        );
        console.log("res", res);
      } else {
        setEdit(0);
        console.log(res);
        getLists();
      }
    } catch (error) {
      console.error("Error editing list.", error.message);
    }

    setEditWarning(editWarning);
  };
  const setListEdit = (index) => {
    isEditing ? setEdit(0) : setEdit(1);
    setEditIndex(index);
  };

  return (
    <div className="public-lists">
      <h1 id="info-title">Add a list</h1>
      <div className="add-list-cont">
        <div className="add-list-inner">
          <p>List Name:</p>
          <input
            maxLength="100"
            type="text"
            id="listName"
            placeholder="List Name"
            onChange={(e) => setnewListName(e.target.value)}
          />
        </div>
        <div className="add-list-inner">
          <p>Description:</p>
          <input
            maxLength="500"
            type="text"
            id="description"
            placeholder="optional"
            onChange={(e) => setDes(e.target.value)}
          />
        </div>
        <div className="add-list-inner">
          <p>Hero IDs:</p>
          <input
            maxLength="500"
            type="text"
            id="heroids"
            placeholder="ex. 18,9,40"
            onChange={(e) =>
              e.target.value !== ""
                ? setheroIDs(e.target.value.split(",").map(Number))
                : setheroIDs([])
            }
          />
        </div>
        <select
          id="ispublic"
          onChange={(e) => setPublic(Number(e.target.value))}
        >
          <option id="no-sort" key="private" value="0">
            Private
          </option>
          <option id="no-sort" key="public" value="1">
            Public
          </option>
        </select>
        <button
          style={{ marginTop: "0.5em" }}
          className="submit-btn"
          onClick={newList}
        >
          Add List
        </button>
        <p id="alertText">{alertText}</p>
      </div>
      <h1 id="info-title">My Hero Lists</h1>

      {heroLists !== null && heroLists !== undefined && (
        <div>
          {heroLists.map((list, index) => (
            <div key={index} className="search-result">
              <h3 id="list-title">
                <div
                  className="result-header"
                  onClick={() => toggleExpansion(index)}
                >
                  {" "}
                  {list.ListName}
                  {expandedResults.includes(index) ? ` ▲` : " ▼"}
                </div>
                <button
                  className="savedList-btn submit-btn"
                  onClick={() => {
                    setListEdit(index);
                  }}
                >
                  {isEditing && editIndex == index ? "Cancel Edit" : "Edit"}
                </button>
                <div className="confim-delete">
                  <button
                    className="savedList-btn submit-btn"
                    onClick={() => setConfirmVis(true)}
                  >
                    Delete
                  </button>
                  {isConfirmVis && (
                    <div className="confirm">
                      <p>Are you sure you want to delete this item?</p>
                      <button onClick={() => deleteList(list)}>Yes</button>
                      <button onClick={() => setConfirmVis(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </h3>

              {isEditing && editIndex == index ? (
                <div id="editing">
                  Edit:
                  <select id="field" onChange={(e) => setField(e.target.value)}>
                    <option key="ListName" value="ListName">
                      List Name
                    </option>
                    <option key="description" value="Description">
                      Description
                    </option>
                    <option key="heroes" value="heroes">
                      Heroes
                    </option>
                    <option key="visibility" value="public">
                      Visibility
                    </option>
                  </select>
                  {field === "ListName" ? (
                    <span>
                      List Name:
                      <input
                        maxLength="100"
                        type="text"
                        id="listName"
                        placeholder=""
                        onChange={(e) => setChangeValue(e.target.value)}
                      />
                    </span>
                  ) : (
                    <></>
                  )}
                  {field === "Description" ? (
                    <span>
                      Description:
                      <input
                        maxLength="1000"
                        type="text"
                        id="listName"
                        placeholder=""
                        onChange={(e) => setChangeValue(e.target.value)}
                      />
                    </span>
                  ) : (
                    <></>
                  )}
                  {field === "heroes" ? (
                    <>
                      <span>
                        Heroes:
                        <input
                          maxLength="500"
                          type="text"
                          id="heroids"
                          placeholder="ex. 18,9,40"
                          onChange={(e) =>
                            e.target.value !== ""
                              ? setChangeValue(
                                  e.target.value.split(",").map(Number)
                                )
                              : setChangeValue([])
                          }
                        />
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                  {field === "public" ? (
                    <>
                      {field ? "visibility" : ""}
                      <select
                        id="ispublic"
                        onChange={(e) => setChangeValue(Number(e.target.value))}
                      >
                        <option id="no-sort" key="private" value="0">
                          Private
                        </option>
                        <option id="no-sort" key="public" value="1">
                          Public
                        </option>
                      </select>
                    </>
                  ) : (
                    <></>
                  )}
                  <button
                    className="savedList-btn submit-btn"
                    onClick={() => submitEdit(list)}
                  >
                    Submit
                  </button>
                  {editWarning}
                </div>
              ) : (
                <></>
              )}
              <p></p>

              {expandedResults.includes(index) && (
                <div className="result-details">
                  <p>Description: {list.description} </p>
                  <p>Visibility: {list.public == 0 ? "private" : "public"} </p>
                  {list.heroes.map((hero, heroIndex) => (
                    <div key={heroIndex}>
                      <div key={heroIndex} className="search-result">
                        <div
                          className="result-header"
                          onClick={() =>
                            toggleExpansionHeroes(index, heroIndex)
                          }
                        >
                          <p id="hero-title">
                            {hero.name}
                            {expandedHeroes.includes(`${index}-${heroIndex}`)
                              ? ` ▲`
                              : " ▼"}
                          </p>
                        </div>
                        {expandedHeroes.includes(`${index}-${heroIndex}`) && (
                          <div className="hero-details">
                            <p className="hero-detail-item">
                              <span className="detail-label">Publisher:</span>{" "}
                              {hero.Publisher}
                              <br />
                              <span className="detail-label">Gender:</span>{" "}
                              {hero.Gender}
                              <br />
                              <span className="detail-label">Race:</span>{" "}
                              {hero.Race}
                              <br />
                              <span className="detail-label">
                                Alignment:
                              </span>{" "}
                              {hero.Alignment}
                              <br />
                              <span className="detail-label">
                                Hair Color:
                              </span>{" "}
                              {hero["Hair color"]}
                              <br />
                              <span className="detail-label">
                                Skin Color:
                              </span>{" "}
                              {hero["Skin color"]}
                              <br />
                              <span className="detail-label">
                                Eye Color:
                              </span>{" "}
                              {hero["Eye color"]}
                              <br />
                              <span className="detail-label">Height:</span>{" "}
                              {hero["Height"]}
                              <br />
                              <span className="detail-label">Weight:</span>{" "}
                              {hero.Weight}
                              <br />
                              <span className="detail-label">Powers:</span>{" "}
                              {hero.powers.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {list.public == 1 && (
                    <div>
                      <div
                        className="result-header"
                        onClick={() => toggleReviews(index)}
                      >
                        <h4>
                          Reviews
                          {reviewsExpanded === index ? " -" : " +"}
                        </h4>
                      </div>

                      {reviewsExpanded === index &&
                        (list.reviews.length > 0 ? (
                          <div className="reviews">
                            {list.reviews.map((review, index) => (
                              <div key={index} className="reviews">
                                <div className="review-item">
                                  <span className="rev-label">Name:</span>{" "}
                                  {review.user}
                                </div>
                                <div className="review-item">
                                  <span className="rev-label">Rating:</span>{" "}
                                  {review.rating}/5
                                </div>
                                <div className="review-item">
                                  <span className="rev-label">Comment:</span>{" "}
                                  {review.comment}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>No reviews to display.</>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLists;
