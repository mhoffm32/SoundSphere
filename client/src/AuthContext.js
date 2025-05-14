import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("lal");
  const [priv, setPriv] = useState("priv policyyyy");
  const [use, setUse] = useState("acceptable use");
  const [dcma, setDcma] = useState("....dcma");

  useEffect(() => {
    getPolicies();
  }, []);

  useEffect(() => {
    const newPolicy = {
      policy: "privacy",
      text: priv,
    };
    updatePolicy(newPolicy);
  }, [priv]);

  useEffect(() => {
    const newPolicy = {
      policy: "accUse",
      text: use,
    };
    updatePolicy(newPolicy);
  }, [use]);

  useEffect(() => {
    const newPolicy = {
      policy: "dcma",
      text: dcma,
    };
    updatePolicy(newPolicy);
  }, [dcma]);

  const updatePolicy = async (newPolicy) => {
    //console.log("MADDY CALLED");
    const send = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPolicy),
    };

    try {
      const response = await fetch("/api/policy/update-policy", send);
      const res = await response.json();
      if (!response.ok) {
        console.error(
          `Request to update policy failed with ${response.status}: ${res.message}`
        );
      } else {
        console.log(res);
      }
    } catch (error) {
      console.error("Error adding new list.", error.message);
    }
  };

  const getPolicies = async () => {
    try {
      const response = await fetch("/api/policy/get-policies");

      const res = await response.json();
      if (!response.ok) {
        console.error(
          `Request to fetch policies ${response.status}: ${res.message}`
        );
      } else {
        setDcma(res.dcma);
        setPriv(res.privacy);
        setUse(res.use);
      }
    } catch (error) {
      console.error("error.", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, priv, setPriv, use, setUse, dcma, setDcma }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
