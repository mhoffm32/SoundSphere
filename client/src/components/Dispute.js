import React from "react";
import UnauthHome from "./UnauthHome";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const Dispute = (props) => {
  const [type, setType] = useState("takedown");
  const [year, setYear] = useState("2023");
  const [day, setDay] = useState("01");
  const [month, setMonth] = useState("01");
  const [review, setReview] = useState("");
  const [notes, setNotes] = useState("");
  const [text, setText] = useState("");
  const { token, setToken } = useAuth();

  const generateOptions = (index) => {
    const options = [];
    for (let i = 1; i <= index; i++) {
      const d = i.toString().padStart(2, "0");
      options.push(
        <option key={d} value={d}>
          {i}
        </option>
      );
    }
    return options;
  };

  const logDispute = async () => {
    setText("");
    if (review) {
      try {
        const newLog = {
          year: year,
          month: month,
          day: day,
          revDetails: review,
          notes: notes,
          type: type,
        };

        const send = {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLog),
        };

        const response = await fetch("http://localhost:5001/logs/newLog", send);
        const res = await response.json();

        if (!response.ok) {
          console.error(
            `Request to log failed with ${response.status}: ${res.message}`
          );
        } else {
          setText(`${type} successfully logged.`);
        }
      } catch (error) {
        console.error("Error adding log.", error.message);
      }
    } else {
      setText("Please include review details. ");
    }
  };

  return (
    <div className="dispute-form">
      <h1 id="info-title">Dispute, Infringement, Takedown Log</h1>
      <div className="infringe-container">
        <p>
          <p className="label-infringe">Request Type:</p>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option key="1" value="takedown">
              Takedown
            </option>
            <option key="2" value="infringement">
              Infringement
            </option>
            <option key="3" value="dispute">
              Dispute
            </option>
          </select>
        </p>
        <p>
          <p className="label-infringe">Year:</p>

          <select onChange={(e) => setYear(e.target.value)}>
            <option key="1" value="2023">
              2023
            </option>
            <option key="2" value="2024">
              2024
            </option>
            <option key="3" value="2025">
              2025
            </option>
          </select>
        </p>
        <p>
          <p className="label-infringe">Month:</p>
          <select
            id="day"
            name="day"
            onChange={(e) => setMonth(e.target.value)}
          >
            {generateOptions(12)}
          </select>
        </p>
        <p>
          <p className="label-infringe">Day:</p>
          <select id="day" name="day" onChange={(e) => setDay(e.target.value)}>
            {generateOptions(31)}
          </select>
        </p>
        <p>
          <p className="label-infringe">Review details:</p>
          <input
            type="text"
            maxLength="500"
            onChange={(e) => setReview(e.target.value)}
          />
        </p>
        <p>
          <p className="label-infringe">Notes:</p>
          <input
            type="text"
            maxLength="500"
            onChange={(e) => setNotes(e.target.value)}
          />
        </p>
        <p>
          <button
            className="submit-btn"
            id="privacyPolicy"
            onClick={logDispute}
          >
            Submit
          </button>
        </p>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Dispute;
