import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("lal");
  const [priv, setPriv] = useState("priv policy");
  const [use, setUse] = useState("acceptable use");
  const [dcma, setDcma] = useState("....dcma");

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
