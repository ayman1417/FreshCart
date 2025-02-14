import React, { useState, useEffect, useContext } from "react";
import { Input as NextInput } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { baseUrl } from "../../Helper/helper.module";
import { p, u, use } from "framer-motion/m";
import { Link, useNavigate } from "react-router-dom";
import { logContext } from "../../Contexts/LogContext";
import { loadContext } from "../../Contexts/LoadContext";
import { profileContext } from "../../Contexts/ProfileContext";
import { motion } from "framer-motion";
export default function ForgetPassword() {
    const navigate = useNavigate();
    const [isLoad, setIsLoad] = useState(false);


    const formik = useFormik({
        initialValues: {
            email: "ao741003@gmail.com",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.post(`${baseUrl}/api/v1/auth/forgotPasswords`, formik.values).then((res) => {
                navigate("/VerfiyCode")
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsLoad(false);
                formik.resetForm();
            });
            console.log(formik.values);
        }

        ,
        validationSchema: Yup.object({
            email: Yup.string().required("Email is Required").email("Invalid email").min(8, "Too short").max(50, "Too long"),
        }),

    });
    return (
        <>
            <div className=" mt-14  container ">
                <motion.div initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: .5 }}
                >
                    <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-1 gap-5 mt-10 shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                        <h1 className="text-3xl font-bold text-center  text-black">
                            Verify Your Email
                        </h1>

                        <p className="text-gray-700  text-center ">
                            Enter your email below to receive a verification link.
                        </p>
                        <NextInput className=" " isInvalid={formik.touched.email && formik.errors.email} errorMessage={formik.errors.email} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name="email" variant="bordered" label="Email" type="email" />
                        <NextBtn isLoading={isLoad} type="submit" className=" p-4 duration-100  bg-black  hover:bg-green-600" color="primary" >Verify Email</NextBtn>
                    </form>
                </motion.div>


            </div>
        </>
    );
}
