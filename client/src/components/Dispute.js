import React from "react";
import UnauthHome from "./UnauthHome";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const Dispute = (props) => {
  const [type, setType] = useState("takedown");
  const [year, setYear] = useState("takedown");
  const [day, setDay] = useState("01");
  const [month, setMonth] = useState("01");
  const [review, setReview] = useState("01");
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
    //do this
  };

  return (
    <div className="dispute-form">
      <h1>Log form ???x? </h1>
      <span>
        Request Type:
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
      </span>
      <span>
        Year:
        <select value={type} onChange={(e) => setYear(e.target.value)}>
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
      </span>
      <span>
        Month:
        <select
          id="day"
          name="day"
          value={day}
          onChange={(e) => setMonth(e.target.value)}
        >
          {generateOptions(12)}
        </select>
      </span>
      <span>
        Day:
        <select
          id="day"
          name="day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          {generateOptions(31)}
        </select>
      </span>
      Infringing Review:
      <input type="text" onChange={setReview(e.target.value)}>
        {" "}
      </input>
      <button id="privacyPolicy" onClick={logDispute}>
        Submit
      </button>
      <p>
        A mechanism is provided to record any takedown request that is received
        along with the date and the review that is alleged to infringe. [ ] A
        mechanism is provided to record any infringement notices that are sent
        along with the date and the review that is alleged to infringe. [ ] A
        mechanism is provided to record any dispute claims that are received
        along with the date and the review that is being disputed.
      </p>
    </div>
  );
};

export default Dispute;
