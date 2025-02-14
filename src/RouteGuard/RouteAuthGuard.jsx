import React from 'react'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom'
import { logContext } from '../Contexts/LogContext'
export default function RouteAuthGuard({ children }) {
    const { isLog, setIsLog } = useContext(logContext);
    return (
        <div>
            { !isLog ?
                children : <Navigate to={"/"}/>
            }
        </div>
    )
}
