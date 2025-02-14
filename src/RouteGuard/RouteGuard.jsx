import React from 'react'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom'
import { logContext } from '../Contexts/LogContext'
import Login from '../pages/Login/Login';
import { loadContext } from '../Contexts/LoadContext';
import Loading from '../pages/Loading/Loading';
// import { loadContext } from '../../Contexts/LoadContext'

export default function RouteGuard({ children }) {
    const { isLog, setIsLog } = useContext(logContext);
    const { loading, setLoading } = useContext(loadContext)

    // if (loading) {
    //     return <Loading/>   
    // }

    return (
        <div>
            { isLog ?
                children : <Login/>
            }
        </div>
    )
}
