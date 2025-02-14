import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
import { baseUrl } from '../Helper/helper.module';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { loadContext } from './LoadContext';
import Loading from '../pages/Loading/Loading';
import { profileContext } from './ProfileContext';
import { useQuery } from '@tanstack/react-query';
export const logContext = createContext(false);

export default function LogContextProvider({ children }) {
    const [isLog, setIsLog] = useState(false)
    const [userId, setuserId] = useState(localStorage.getItem('userId') || '');
    const { userName, setUserName } = useContext(profileContext);
    const { userEmail, setUserEmail } = useContext(profileContext);
    const { isProfile, setIsProfile } = useContext(profileContext);
    const [wishlist, setWishlist] = useState();

    const { loading, setLoading } = useContext(loadContext);

    useEffect(() => {
        verfiyUser();
    }, []);

    async function getCartUser() {
        const res = await axios.get(`${baseUrl}/api/v1/cart`, {
            headers: {
                token: localStorage.getItem("token")
            },
        })
    
        return res.data.data;
    }

    const { data: cart, error, isError, isLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: getCartUser,
        staleTime: 10000
    });


    function getUserData() {
        axios.get(`${baseUrl}/api/v1/users?_id=${localStorage.getItem('userId')}`)
            .then((res) => {
    
                setUserName(res.data.users[0].name)
                setUserEmail(res.data.users[0].email)
            }).catch((err) => {
                console.log(err)
            }).finally((err) => {
            })
    }

    function getUserWishList() {
        axios.get(`${baseUrl}/api/v1/wishlist`, {
            headers: {
                token: localStorage.getItem("token")
            },
        }).then((res) => {
            setWishlist(res.data)
        }).catch((err) => {
            console.log(err)
        }).finally((err) => {
        })
    }



    function verfiyUser() {
        setLoading(true)
        axios.get(`${baseUrl}/api/v1/auth/verifyToken`, {
            headers: {
                token: localStorage.getItem("token")
            }
        }).then((res) => {
            setIsLog(true);

            localStorage.setItem('userId', res.data.decoded.id);
            getUserData();
            getUserWishList();

        }).catch((err) => {
            console.log(err)
            localStorage.removeItem("token")
            setIsLog(false);
        }).finally(() => {
            setLoading(false)
        })
    }

    

    if (loading) {
        return <Loading />
    }

    return (
        <logContext.Provider value={{ isLog, setIsLog, userId, setuserId, wishlist, setWishlist }}>
            {children}
        </logContext.Provider>
    )
}
