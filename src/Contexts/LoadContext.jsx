import React, { createContext, useState } from 'react'

export const loadContext = createContext();
export default function LoadContextProvider({ children }) {
    const [loading, setLoading] = useState(false)
    return (
        <loadContext.Provider value={{ loading, setLoading }}>
            {children}
        </loadContext.Provider>
    )
}
