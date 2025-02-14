import React, { createContext, useState } from 'react'

export const profileContext = createContext();
export default function ProfileContextProvider({ children }) {
    const [isProfile, setIsProfile] = useState(true)
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPhone, setUserPhone] = useState("")
    const [userPassword, setUserPassword] = useState("")
    return (
        <profileContext.Provider value={{ isProfile, setIsProfile, userName, setUserName, userEmail, setUserEmail, userPhone, setUserPhone, userPassword, setUserPassword }}>
            {children}
        </profileContext.Provider>
    )
}
