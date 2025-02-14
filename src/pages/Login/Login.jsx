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
import { motion } from 'framer-motion';
import Register from "../Register/Register";

export default function Login() {
    const navigate = useNavigate();
    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const { isLog, setIsLog } = useContext(logContext);
    const { userName, setUserName } = useContext(profileContext);
    const { userEmail, setUserEmail } = useContext(profileContext);
    const { userPassword, setUserPassword } = useContext(profileContext);
    const { loading, setLoading } = useContext(loadContext);
    const [isActive, setIsActive] = useState(false);


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.post(`${baseUrl}/api/v1/auth/signin?`, formik.values).then((res) => {
                setIsLog(true)
                console.log(res.data);
                console.log(res.data.token);
                console.log(res.data.user.name);
                setUserName(res.data.user.name)
                localStorage.setItem("token", res.data.token)
                navigate(location.pathname == "/login" ? "/" : location.pathname);
            }).catch((err) => {
                console.log(err.response.data.message);
                setEmailErr(err.response.data.message);
            }).finally(() => {
                setIsLoad(false);
            });
            setUserEmail(formik.values.email)
            setUserPassword(formik.values.password)
            console.log(formik.values);
        }

        ,
        validationSchema: Yup.object({
            email: Yup.string().required("Email is Required").email("Invalid email").min(8, "Too short").max(50, "Too long"),
            password: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long"),
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
                            Login to Your Account
                        </h1>

                        <NextInput className="" isInvalid={formik.touched.email && formik.errors.email} errorMessage={formik.errors.email} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email} name="email" variant="bordered" label="Email" type="email" />
                        <NextInput className=" " isInvalid={formik.touched.password && formik.errors.password} errorMessage={formik.errors.password} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name="password" variant="bordered" label="Password" type="password" />
                        {emailErr && <p className="ms-2  text-red-500 ">{emailErr}</p>}
                        <div className="flex justify-between font-medium ">
                            <Link to={"/forgetPassword"} className=" px-2 duration-100 text-md  hover:text-red-600" >Forget Password ?</Link>
                            <Link to={"/register"} className=" px-2 text-black hover:text-blue-800 duration-100">
                                Create an Account
                            </Link>
                        </div>
                        <NextBtn isLoading={isLoad} type="submit" className=" p-4  bg-black" color="primary" >Login</NextBtn>
                    </form>
                </motion.div>
                {/* <button  className="bg-red-500 " onClick={() => setIsActive(!isActive)}> click</button>
                <div className={`absolute bg-black h-full top-0 left-0 transition-all duration-500 ${isActive ? "w-full" : "w-0"
                    }`}></div> */}
            </div>
        </>
    );
}
