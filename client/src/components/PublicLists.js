import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const PublicLists = (props) => {
  const [expandedResults, setExpandedResults] = useState([]);
  const [expandedHeroes, setExpandedHeroes] = useState([]);
  const [heroLists, setLists] = useState();
  const [reviewsExpanded, setReviewsExpanded] = useState([]);
  const [currRating, setRating] = useState(0);
  const [currComment, setComment] = useState("");
  const { token, setToken } = useAuth();

  const user = props.user ? props.user : false;

  const toggleExpansion = (index) => {
    if (expandedResults.includes(index)) {
      setExpandedResults(
        expandedResults.filter((expandedIndex) => expandedIndex !== index)
      );
    } else {
      setExpandedResults([...expandedResults, index]);
    }
    getLists();
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

  const getLists = async () => {
    try {
      const response = await fetch(`/api/express/lists/public-lists`);
      const listObj = await response.json();

      if (!response.ok) {
        console.error(
          `Request to fetch lists failed with status ${response.status}: ${response.statusText}`
        );
      } else {
        console.log(listObj);
        setLists(listObj);
      }
    } catch (error) {
      console.error("Error fetching Public Lists:", error.message);
    }
  };

  const postReview = async (listID, listName) => {
    console.log(token);
    try {
      const newReview = {
        user: user.nName,
        rating: Number(currRating),
        comment: currComment,
        listID: listID,
        listName: listName,
      };

      const send = {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(newReview), // Convert the object to a JSON string
      };

      const response = await fetch("/api/express/lists/add-review", send);
      const res = await response.json();

      if (!response.ok) {
        console.error(
          `Request to add review failed with ${response.status}: ${response.statusText}`
        );
      } else {
        console.log(res);
        getLists();
      }
    } catch (error) {
      console.error("Error adding new review.", error.message);
    }
  };

  const manageReview = async (list, review) => {
    try {
      const info = {
        list: list,
        review: review,
      };
      const send = {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(info), // Convert the object to a JSON string
      };

      const response = await fetch("/api/express/lists/manage-review", send);
      const res = await response.json();

      if (!response.ok) {
        console.error(
          `Request to edit review failed with ${response.status}: ${response.statusText}`
        );
      } else {
        console.log("all good");
        console.log(res);
        getLists();
      }
    } catch (error) {
      console.error("Error adding new review.", error.message);
    }
  };

  return (
    <div className="public-lists">
      <h1>Public Hero Lists</h1>
      {heroLists !== null && heroLists !== undefined && (
        <div>
          {heroLists.map((list, index) => (
            <div key={index} className="search-result">
              {index <= 10 ? (
                <>
                  <div
                    className="result-header"
                    onClick={() => toggleExpansion(index)}
                  >
                    <h3>
                      {" "}
                      {list.ListName} | Created By: {list.creator} | Heroes:{" "}
                      {list.heroes.length} | Rating:{" "}
                      {list.rating ? <>{list.rating}</> : <>N/A</>}{" "}
                      {expandedResults.includes(index) ? ` ▲` : " ▼"}
                    </h3>
                  </div>
                  {expandedResults.includes(index) && (
                    <div className="result-details">
                      <p>Description: {list.description} </p>
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
                                {expandedHeroes.includes(
                                  `${index}-${heroIndex}`
                                )
                                  ? ` ▲`
                                  : " ▼"}
                              </p>
                            </div>
                            {expandedHeroes.includes(
                              `${index}-${heroIndex}`
                            ) && (
                              <div className="hero-details">
                                <p className="hero-detail-item">
                                  <span className="detail-label">
                                    Publisher:
                                  </span>{" "}
                                  {hero.Publisher}
                                  <br />
                                  <span className="detail-label">
                                    Gender:
                                  </span>{" "}
                                  {hero.Gender}
                                  <br />
                                  <span className="detail-label">
                                    Race:
                                  </span>{" "}
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
                                  <span className="detail-label">
                                    Height:
                                  </span>{" "}
                                  {hero["Height"]}
                                  <br />
                                  <span className="detail-label">
                                    Weight:
                                  </span>{" "}
                                  {hero.Weight}
                                  <br />
                                  <span className="detail-label">
                                    Powers:
                                  </span>{" "}
                                  {hero.powers.join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {user && (
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
                          {reviewsExpanded === index && (
                            <div className="reviews">
                              {list.reviews == null ? (
                                <>No reviews to display</>
                              ) : (
                                <>
                                  {list.reviews.map((review, index) => (
                                    <div key={index} className="reviews">
                                      {!review.hidden && !user.admin ? (
                                        <>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Name:
                                            </span>{" "}
                                            {review.user}
                                          </div>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Rating:
                                            </span>{" "}
                                            {review.rating}/5
                                          </div>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Comment:
                                            </span>{" "}
                                            {review.comment}
                                          </div>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Date:
                                            </span>
                                            {review.editDate
                                              ? review.editDate
                                              : "n/a"}
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {user.admin ? (
                                        <>
                                          <p></p>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Name:
                                            </span>{" "}
                                            {review.user}
                                          </div>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Rating:
                                            </span>{" "}
                                            {review.rating}/5
                                          </div>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Comment:
                                            </span>{" "}
                                            {review.comment}
                                          </div>
                                          <div className="review-item">
                                            <span className="rev-label">
                                              Date:
                                              {review.editDate
                                                ? review.editDate
                                                : "n/a"}
                                            </span>{" "}
                                          </div>
                                          <button
                                            onClick={() =>
                                              manageReview(list, review)
                                            }
                                          >
                                            {review.hidden ? (
                                              <>Unhide review</>
                                            ) : (
                                              <>Mark as Infringing</>
                                            )}
                                          </button>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  ))}
                                </>
                              )}
                              <h4 id="your-rating">Leave a Review:</h4>
                              <div className="review-item">
                                <span className="rev-label">Name:</span>{" "}
                                {user.nName}
                              </div>
                              <div className="review-item">
                                <span className="rev-label"> Rating:</span>
                                <input
                                  id="rev_input"
                                  type="range"
                                  min="0"
                                  max="5"
                                  step="any"
                                  defaultValue="2.5"
                                  onChange={(e) => {
                                    setRating(
                                      Number(e.target.value).toFixed(1)
                                    );
                                  }}
                                />
                                {currRating}
                              </div>
                              <div className="review-item">
                                <span className="rev-label"> Comment:</span>
                                <input
                                  maxLength="1000"
                                  type="text"
                                  placeholder="optional"
                                  onChange={(e) => {
                                    setComment(e.target.value);
                                  }}
                                />
                                <button
                                  onClick={() =>
                                    postReview(list.id, list.ListName)
                                  }
                                >
                                  Post
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicLists;
