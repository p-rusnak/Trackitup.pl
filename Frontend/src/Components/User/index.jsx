import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiClient } from "../../API/httpService";

const UserContext = createContext({ user: null, setUser: () => {} });

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const apiClient = new ApiClient();
      apiClient
        .getUser(payload.sub)
        .then((r) => setUser(r.data))
        .catch((e) => console.error("Failed to fetch user", e));
    } catch (e) {
      console.error("Failed to parse token", e);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
