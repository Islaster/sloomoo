import React, { createContext, useState } from "react";

// Create a context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [prompt, setPrompt] = useState("");

    return (
        <AppContext.Provider value={{ prompt, setPrompt }}>
            {children}
        </AppContext.Provider>
    );
};
