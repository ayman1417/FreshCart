import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button as NextBtn } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Correct import for Yup
import axios from "axios";
import { p, u, use } from "framer-motion/m";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../Helper/helper.module";
import { Bounce, toast } from 'react-toastify'
export default function ChangePassword() {

    const [emailErr, setEmailErr] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            password: "",
            rePassword: "",
        },
        onSubmit: () => {
            setIsLoad(true);
            axios.put(`${baseUrl}/api/v1/users/changeMyPassword`, formik.values, {
                headers: {
                    token: `${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res);
                toast.success(`Password Changed`, {
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
            }).catch((err) => {
                console.log(err);
                toast.error(`Change Faild`, {
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
            formik.resetForm()
            console.log(formik.values);
        }

        ,
        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long"),
            password: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long"),
            rePassword: Yup.string().required("Password is Required").min(8, "Too short").max(50, "Too long").oneOf([Yup.ref("password"), null], "Passwords must match"),
        }),
    });

    return (
        <div>
            <div className=" ">
                <form onSubmit={formik.handleSubmit} className=" max-w-screen-sm m-auto grid grid-cols-1 gap-5  shadow-xl border-black border-opacity-20 border-2 p-5 rounded-2xl" >
                    <h1 className="sm:text-3xl text-2xl font-bold text-center mb-6 text-gray-800">
                        Change password
                    </h1>
                    <Input className=" " isInvalid={formik.touched.currentPassword && formik.errors.currentPassword} errorMessage={formik.errors.currentPassword} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.currentPassword} name="currentPassword" variant="bordered" label="currentPassword" type="password" />
                    <Input className=" " isInvalid={formik.touched.password && formik.errors.password} errorMessage={formik.errors.password} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password} name="password" variant="bordered" label="Password" type="password" />
                    <Input className="" isInvalid={formik.touched.rePassword && formik.errors.rePassword} errorMessage={formik.errors.rePassword} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.rePassword} name="rePassword" variant="bordered" label="Repassword" type="password" />
                    {emailErr && <p className="text-red-500 ">{emailErr}</p>}
                    <NextBtn isLoading={isLoad} type="submit" className=" p-4 bg-black" color="primary" >Save</NextBtn>
                </form>


            </div>
        </div>
    )
}
