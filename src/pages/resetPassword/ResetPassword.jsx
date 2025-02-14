import React, { useState, useEffect, useContext } from "react";
import { Input as NextInput } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; 
import axios from "axios";
import { baseUrl } from "../../Helper/helper.module";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export default function ResetPassword() {
    const navigate = useNavigate();
    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
   
    const formik = useFormik({
        initialValues: {
            email: "",
            newPassword: "",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.put(`${baseUrl}/api/v1/auth/resetPassword?`, formik.values).then((res) => {
                navigate("/login");
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoad(false);
            });
        }

        ,
        validationSchema: Yup.object({
            email: Yup.string().required("Email is Required").email("Invalid email").min(8, "Too short").max(50, "Too long"),
            newPassword: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long"),
        }),
    });
    return (
        <>
            <div className=" container ">
                <motion.div initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: .5 }}
                >
                    <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-1 gap-5 mt-14 shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                        <h1 className="sm:text-3xl text-2xl font-bold text-center mb-6 text-gray-800">
                            Reset your account password
                        </h1>

                        <NextInput className="" isInvalid={formik.touched.email && formik.errors.email} errorMessage={formik.errors.email} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name="email" variant="bordered" label="Email" type="email" />
                        <NextInput className=" " isInvalid={formik.touched.newPassword && formik.errors.newPassword} errorMessage={formik.errors.newPassword} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.newPassword} name="newPassword" variant="bordered" label="newPassword" type="password" />
                        {emailErr && <p className="ms-2  text-red-500 ">{emailErr}</p>}
                        <NextBtn isLoading={isLoad} type="submit" className=" p-4  bg-black" color="primary" >Reset Password</NextBtn>
                    </form>
                </motion.div>


            </div>
        </>
    );
}
