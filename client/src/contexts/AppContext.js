import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

// Create a context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [poem, setPoem] = useState("");
  const [uniqueId, setUniqueId] = useState(0);
  const baseURL = process.env.REACT_APP_SERVER_URL;
  const socket = io(baseURL, {
    transports: ["websocket"],
  });
  useEffect(() => {
    socket.on("connect", () => console.log("socket connected: ", socket.id));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        prompt,
        setPrompt,
        poem,
        setPoem,
        socket,
        baseURL,
        uniqueId,
        setUniqueId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
