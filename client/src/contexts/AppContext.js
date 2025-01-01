import React, { createContext, useState } from "react";

// Create a context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [prompt, setPrompt] = useState("");
    const [poem, setPoem] = useState("");

    return (
        <AppContext.Provider value={{ prompt, setPrompt, poem, setPoem }}>
            {children}
        </AppContext.Provider>
    );
};
