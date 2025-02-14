import React from 'react'
import { useContext } from 'react';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { Input as NextInput, user } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { p, u, use } from "framer-motion/m";
import { profileContext } from "../../Contexts/ProfileContext";
import { logContext } from "../../Contexts/LogContext";
import { baseUrl } from "../../Helper/helper.module";
import Loading from '../Loading/Loading';
import { loadContext } from '../../Contexts/LoadContext';
import UpdateProfile from '../../Components/UpdateProfile/UpdateProfile';
import ChangePassword from '../../Components/ChangePassword/ChangePassword';
import { Bounce, toast } from 'react-toastify'
import { motion } from 'framer-motion';
export default function Profile() {
    const navigate = useNavigate();
    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const { userName, setUserName, userEmail, setUserEmail } = useContext(profileContext);
    const { isProfile, setIsProfile } = useContext(profileContext);
    const { loading, setLoading } = useContext(loadContext);




    const formik = useFormik({
        initialValues: {
            name: userName,
            email: userEmail,
            phone: "+20",
        },
        enableReinitialize: true, 

        onSubmit: () => {
            console.log(formik.values);

            setIsLoad(true);
            axios.put(`${baseUrl}/api/v1/users/updateMe`, formik.values, {
                headers: {
                    token: `${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res);
                setUserEmail(formik.values.email)
                setUserName(formik.values.name)
                toast.success(`Updated Successfully`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    style: { width: '350px' }, 

                });
            }).catch((err) => {
                console.log(err);
                toast.error(`Updated Faild`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    style: { width: '350px' }, // Set the desired width here

                });
            }).finally(() => {
                setIsLoad(false);
            });

            console.log(formik.values);

        }

        ,
        validationSchema: Yup.object({
            name: Yup.string().required("Name is Required").min(3, "Too short").max(50, "Too long"),
            email: Yup.string().required("Email is Required").email("Invalid email").min(8, "Too short").max(50, "Too long"),
            phone: Yup.string().required("Phone is Required").matches(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "Phone must start with +20 and contain 10 digits"),
        }),
    });



    console.log(loading);
    if (loading) {
        return <Loading />;
    }

    return (
        <div className='mt-14'>
            <motion.div initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: .5 }}
            >
                {isProfile ? (
                    <UpdateProfile formik={formik} isLoad={isLoad} emailErr={emailErr} />

                ) :

                    <ChangePassword />

                }
            </motion.div>
        </div>
    )
}
